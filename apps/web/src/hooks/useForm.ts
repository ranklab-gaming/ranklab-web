import { ResponseError } from "@ranklab/api"
import { capitalize } from "lodash"
import { useSnackbar } from "notistack"
import {
  FieldValues,
  Path,
  UseFormProps as BaseUseFormProps,
  UseFormReturn,
  UseFormSetError,
  useForm as baseUseForm,
  SubmitHandler,
} from "react-hook-form"

type Errors<T> = {
  [key in Path<T>]: Error[]
}

type Error = {
  message?: string
} & (
  | {
      code: "length"
      params: {
        min?: number
        max?: number
      }
    }
  | {
      code: "custom"
      params: {}
    }
)

function errorMessageFromError<T>(field: Path<T>, error: Error) {
  switch (error.code) {
    case "length":
      return `${capitalize(field)} must be at least ${
        error.params.min
      } characters long`
  }

  return `${capitalize(field)} is invalid`
}

function setValidationErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  errors: Errors<T>
) {
  let field: Path<T>

  for (field in errors) {
    setError(field, {
      type: "server",
      message: errors[field]
        .map((e) => errorMessageFromError(field, e))
        .join(", "),
    })
  }
}

interface UseFormProps<TFieldValues extends FieldValues, TContext = any>
  extends BaseUseFormProps<TFieldValues, TContext> {
  serverErrorMessage?: string
  errorMessages?: {
    [key: number]: string
  }
}

export function useForm<TFieldValues extends FieldValues, TContext = any>(
  props: UseFormProps<TFieldValues, TContext>
): UseFormReturn<TFieldValues, TContext> {
  const form = baseUseForm(props)
  const { enqueueSnackbar } = useSnackbar()

  const submitHandler = async (
    data: TFieldValues,
    handler: SubmitHandler<TFieldValues>
  ) => {
    try {
      await handler(data)
    } catch (e: unknown) {
      if (!(e instanceof ResponseError)) {
        throw e
      }

      if (e.response.status === 422) {
        const errors = await e.response.json()

        if ("error" in errors && !Array.isArray(errors.error)) {
          return
        }

        setValidationErrors(form.setError, errors)
        return
      }

      if (props.errorMessages && e.response.status in props.errorMessages) {
        enqueueSnackbar(props.errorMessages[e.response.status], {
          variant: "error",
        })

        return
      }

      enqueueSnackbar(
        props.serverErrorMessage ??
          "An unexpected server error occurred, please try again later.",
        {
          variant: "error",
        }
      )
    }
  }

  return {
    ...form,
    handleSubmit(handler) {
      return form.handleSubmit((data) => submitHandler(data, handler))
    },
  }
}
