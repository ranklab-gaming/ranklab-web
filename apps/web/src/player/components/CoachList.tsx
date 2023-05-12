import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  Grid,
  useTheme,
} from "@mui/material"
import NextLink from "next/link"
import { Coach } from "@ranklab/api"
import { AvatarImage } from "@/components/ReviewRequestPage"
import { Avatar } from "@/components/Avatar"
import { uploadsCdnUrl } from "@/config"
import { useGameDependency } from "@/hooks/useGameDependency"
import { useState } from "react"

interface Props {
  coaches: Coach[]
}

interface CoachCardProps {
  coach: Coach
}

const CoachCard = ({ coach }: CoachCardProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const theme = useTheme()
  const buttonText = useGameDependency("text:request-review-button")

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
      }}
    >
      <CardContent>
        <Stack spacing={4}>
          <Stack direction="row" spacing={2} alignItems="center">
            {coach.avatarImageKey ? (
              <AvatarImage
                src={`${uploadsCdnUrl}/${coach.avatarImageKey}`}
                alt={coach.name}
              />
            ) : (
              <Avatar
                user={{ name: coach.name }}
                sx={{ width: 48, height: 48 }}
              />
            )}
            <Typography variant="h3">{coach.name}</Typography>
          </Stack>
          <Typography variant="body1" component="div">
            <pre
              style={{ fontFamily: "inherit", whiteSpace: "pre-wrap" }}
              dangerouslySetInnerHTML={{
                __html: isOpen ? coach.bio : `${coach.bio.substring(0, 50)}...`,
              }}
            />
          </Typography>
          <Box>
            <NextLink
              href={{
                pathname: "/player/reviews/new",
                query: { coach_id: coach.id },
              }}
              passHref
              legacyBehavior
            >
              <Button
                size="large"
                variant="text"
                sx={{
                  fontSize: 18,
                  p: 3,
                  color: "common.white",
                  transition: "all 0.25s",
                  backgroundImage: `linear-gradient( 136deg, ${theme.palette.primary.main} 0%, ${theme.palette.error.main} 50%, ${theme.palette.secondary.main} 100%)`,
                  boxShadow: "0 4px 12px 0 rgba(0,0,0,.35)",
                  "&:hover": {
                    filter: "brightness(1.3)",
                  },
                }}
              >
                {buttonText}
              </Button>
            </NextLink>
          </Box>
        </Stack>
      </CardContent>
      <Button onClick={handleClick}>
        {isOpen ? "Show Less" : "Show More"}
      </Button>
    </Card>
  )
}

export const CoachList = ({ coaches }: Props) => {
  return (
    <Grid container spacing={2}>
      {coaches.map((coach) => {
        return (
          <Grid item xs={12} md={6} xl={4} key={coach.id}>
            <CoachCard coach={coach} />
          </Grid>
        )
      })}
    </Grid>
  )
}
