import * as React from "react"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"
import { Chip, MenuItem, Stack, TextField } from "@mui/material"
import { Coach, Game } from "@ranklab/api"
import { Avatar } from "@/components/Avatar"
import { ChangeEventHandler } from "react"
import { formatPrice } from "@/utils/formatPrice"

interface Props {
  coaches: Coach[]
  onChange: ChangeEventHandler
  value: string
  onBlur: () => void
  error: boolean
  helperText?: string
}

export function CoachesSelect({
  coaches,
  error,
  onBlur,
  onChange,
  helperText,
  value,
}: Props) {
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
