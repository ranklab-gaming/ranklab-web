import { animateFade } from "@/animate/fade"
import { GameIcon } from "@/components/GameIcon"
import { GameRequestDialog } from "@/components/GameRequestDialog"
import { MotionContainer } from "@/components/MotionContainer"
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { Game } from "@ranklab/api"
import { m } from "framer-motion"
import { useState } from "react"

const RootStyle = styled("div")(({ theme }) => ({
  paddingTop: theme.spacing(24),
}))

interface Props {
  games: Game[]
}

export const SupportedGames = ({ games }: Props) => {
  const [gameRequestDialogOpen, setGameRequestDialogOpen] = useState(false)

  return (
    <RootStyle>
      <Container maxWidth="lg" component={MotionContainer}>
        <m.div variants={animateFade().inDown}>
          <Typography variant="h1" component="h3" sx={{ textAlign: "center" }}>
            Games we support
          </Typography>
        </m.div>
        <Box sx={{ mt: 10, display: "flex", justifyContent: "center" }}>
          <m.div variants={animateFade().inUp}>
            <Grid container spacing={2}>
              {games.map((game) => (
                <Grid item xs={6} sm={6} md={4} lg={3} key={game.id}>
                  <Card
                    key={game.id}
                    elevation={12}
                    sx={{
                      m: 1,
                      height: 160,
                      alignItems: "center",
                      justifyContent: "center",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardHeader
                      title={game.name}
                      titleTypographyProps={{
                        whiteSpace: "nowrap",
                        textAlign: "center",
                      }}
                    />
                    <CardContent>
                      <GameIcon
                        key={game.id}
                        game={game}
                        sx={{ width: 48, height: 48, margin: "auto" }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              <Grid item xs={6} sm={6} md={4} lg={3}>
                <Card
                  elevation={12}
                  sx={{
                    m: 1,
                    height: 160,
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "grey.900",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textAlign: "center" }}
                    >
                      Don&apos;t see your game?{" "}
                      <Button
                        onClick={() => setGameRequestDialogOpen(true)}
                        sx={{ textTransform: "none" }}
                        color="secondary"
                      >
                        Let us know!
                      </Button>
                      <GameRequestDialog
                        open={gameRequestDialogOpen}
                        onClose={() => setGameRequestDialogOpen(false)}
                      />
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </m.div>
        </Box>
      </Container>
    </RootStyle>
  )
}
