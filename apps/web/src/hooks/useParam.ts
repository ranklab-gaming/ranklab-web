import { useRouter } from "next/router"

export function useParam(
  name: string,
  defaultValue?: string,
  allowedValues?: string[]
) {
  const router = useRouter()
  const param = router.query[name]

  const value = Array.isArray(param) ? param[0] : param ?? ""

  if (allowedValues && !allowedValues.includes(value)) {
    return defaultValue
  }

  return value
}
