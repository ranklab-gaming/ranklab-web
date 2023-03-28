import { Avatar } from "@/components/Avatar"
import { formatPrice } from "@/player/helpers/formatPrice"
import { Chip, MenuItem, Stack, TextField } from "@mui/material"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"
import { Coach } from "@ranklab/api"
import { ChangeEventHandler } from "react"

interface Props {
  coaches: Coach[]
  onChange: ChangeEventHandler
  value: string
  onBlur: () => void
  error: boolean
  helperText?: string
}

export const CoachSelect = ({
  coaches,
  error,
  onBlur,
  onChange,
  helperText,
  value,
}: Props) => {
  return (
    <TextField
      select
      label="Coach"
      onChange={onChange}
      value={value}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
    >
      {coaches.map((coach) => (
        <MenuItem
          key={coach.id}
          value={coach.id}
          sx={{ alignItems: "flex-end" }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar user={coach} />
            <ListItemText
              primary={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle1">{coach.name}</Typography>
                  <Chip label={formatPrice(coach.price)} size="small" />
                </Stack>
              }
              secondary={
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {coach.bio}
                </Typography>
              }
            />
          </Stack>
        </MenuItem>
      ))}
    </TextField>
  )
}
