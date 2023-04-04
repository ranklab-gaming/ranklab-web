import { Iconify } from "@/components/Iconify"
import {
  Button,
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

  const handleClick = () => {
    enqueueSnackbar("Copied to clipboard.", { variant: "success" })
    if (!navigator.clipboard) return
    navigator.clipboard.writeText(window.location.toString())
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
