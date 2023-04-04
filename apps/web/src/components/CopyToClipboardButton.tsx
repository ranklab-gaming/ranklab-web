import { Iconify } from "@/components/Iconify"
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material"
import { useSnackbar } from "notistack"

interface Props {
  value: string
  label: string
  helperText?: string
}

const CopyToClipboardButton = ({ value, label, helperText }: Props) => {
  const { enqueueSnackbar } = useSnackbar()

  const handleClick = async () => {
    if (!navigator.clipboard) return
    await navigator.clipboard.writeText(value)
    enqueueSnackbar("Copied to clipboard.", { variant: "success" })
  }

  return (
    <FormControl variant="outlined">
      <InputLabel>{label}</InputLabel>
      <OutlinedInput
        type="text"
        value={value}
        readOnly
        endAdornment={
          <InputAdornment position="end">
            <IconButton onClick={handleClick} edge="end">
              <Iconify icon="eva:copy-outline" />
            </IconButton>
          </InputAdornment>
        }
        label={label}
      />
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  )
}

export default CopyToClipboardButton
