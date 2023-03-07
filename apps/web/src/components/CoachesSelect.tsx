import * as React from "react"
import ListItemText from "@mui/material/ListItemText"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import Typography from "@mui/material/Typography"
import { Box, MenuItem, Select, SelectChangeEvent, Stack } from "@mui/material"
import { Coach } from "@ranklab/api"
import { Avatar } from "@/components/Avatar"

interface Props {
  coaches: Coach[]
  onChange: (event: SelectChangeEvent) => void
  value: string
  onBlur: () => void
  error: boolean
}

export function CoachesSelect({
  coaches,
  error,
  onBlur,
  onChange,
  value,
}: Props) {
  return (
    <Select
      label="Coach"
      onChange={onChange}
      value={value}
      onBlur={onBlur}
      error={error}
    >
      {coaches.map((coach) => (
        <MenuItem
          key={coach.id}
          value={coach.id}
          sx={{ alignItems: "flex-end" }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar />
            <ListItemText
              primary={coach.name}
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
    </Select>
  )
}
