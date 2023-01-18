import {
  CircularProgress,
  AutocompleteProps as MUIAutocompleteProps,
  TextField,
} from "@mui/material"
import { ChangeEvent, FunctionComponent, useCallback, useState } from "react"
import { Autocomplete as MUIAutocomplete } from "@mui/material"
import { debounce } from "lodash"
import { FieldError } from "react-hook-form"

interface Option {
  label: string
  value: string
}

interface AutocompleteProps
  extends Pick<
    MUIAutocompleteProps<Option, false, false, false>,
    "onChange" | "onBlur" | "noOptionsText"
  > {
  label: string
  search: (query: string) => Promise<Option[]>
  error?: FieldError
}

const Autocomplete: FunctionComponent<AutocompleteProps> = ({
  search,
  onChange,
  label,
  onBlur,
  error,
  noOptionsText,
}) => {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      setLoading(true)
      try {
        const results = await search(query)
        setOptions(results)
      } finally {
        setLoading(false)
      }
    }, 300),
    [search]
  )

  return (
    <MUIAutocomplete
      open={open}
      onOpen={() => {
        setOpen(true)
      }}
      onClose={() => {
        setOpen(false)
      }}
      isOptionEqualToValue={(option, selectedOption) =>
        option.value === selectedOption.value
      }
      getOptionLabel={(option) => option.label}
      options={options}
      loading={loading}
      onChange={onChange}
      onBlur={onBlur}
      noOptionsText={noOptionsText}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={Boolean(error)}
          helperText={error?.message}
          value={params.inputProps.value}
          onChange={(event) => {
            params.inputProps.onChange?.(event as ChangeEvent<HTMLInputElement>)
            handleSearch(event.target.value)
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}

export default Autocomplete
