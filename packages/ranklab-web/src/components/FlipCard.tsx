import {
  Box,
  Card as MuiCard,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material"
import { motion } from "framer-motion"
import { FunctionComponent } from "react"
import { styled } from "@mui/material/styles"

interface FlipCardProps {
  selectedIndex: number | null
  index: number
  frontText: string
  backText: string
  onClickFront: () => void
  onClickBack: () => void
}

const cardVariants = {
  front: { rotateY: 0 },
  back: { rotateY: 180 },
}

const Inner = styled(motion.div)(() => ({
  position: "relative",
  width: "inherit",
  height: "inherit",
  transformStyle: "preserve-3d",
}))

const Card = styled(MuiCard)(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backfaceVisibility: "hidden",
}))

const FlipCard: FunctionComponent<FlipCardProps> = ({
  selectedIndex,
  index,
  frontText,
  backText,
  onClickFront,
  onClickBack,
}) => {
  return (
    <Box
      sx={{
        width: "300px",
        height: "300px",
      }}
    >
      <Inner
        variants={cardVariants}
        initial="front"
        animate={selectedIndex === index ? "back" : "front"}
      >
        <Card
          sx={{
            backgroundColor: "green",
            borderStyle: "solid",
            borderWidth: "2px",
          }}
        >
          <CardActionArea
            onClick={onClickFront}
            sx={{
              width: "100%",
              height: "100%",
            }}
          >
            <CardContent>
              <Typography variant="h5" component="div">
                {frontText}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card
          sx={{
            transform: "rotateY(180deg)",
          }}
        >
          <CardActionArea
            onClick={onClickBack}
            sx={{
              width: "100%",
              height: "100%",
            }}
          >
            <CardContent>
              <Typography variant="h5" component="div">
                {backText}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Inner>
    </Box>
  )
}

export default FlipCard
