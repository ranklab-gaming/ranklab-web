import {
  Box,
  Chip,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  useTheme,
} from "@mui/material"

interface Option {
  label: string
  value: string
}

interface Props {
  error?: boolean
  helperText?: string
  value: string[]
  options: Option[]
  onChange: (value: string[]) => void
  label?: string
}

const itemHeight = 48
const itemPaddingTop = 8

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: itemHeight * 4.5 + itemPaddingTop,
      width: 250,
    },
  },
}

export function MultiSelect({
  value,
  error,
  onChange,
  label,
  options,
  helperText,
}: Props) {
  const theme = useTheme()

  return (
    <>
      <InputLabel error={error}>Games</InputLabel>
      <Select
        multiple
        value={value}
        onChange={(event) => onChange(event.target.value as string[])}
        input={<OutlinedInput label={label} />}
        error={error}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip
                key={value}
                label={options.find((g) => g.value === value)!.label}
              />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            style={{
              fontWeight: value.includes(option.value)
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && (
        <FormHelperText error={error}>{helperText}</FormHelperText>
      )}
      <FormLabel
        sx={{
          marginBottom: 3,
          color: error ? "error.main" : undefined,
        }}
      >
        {label}
      </FormLabel>
    </>
  )
}

export default MultiSelect
