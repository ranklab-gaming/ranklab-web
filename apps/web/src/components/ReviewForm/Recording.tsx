import { Box, IconButton, Stack, Tooltip } from "@mui/material"
import { Toolbar } from "./Toolbar"
import { PropsWithChildren, forwardRef } from "react"
import { uploadsCdnUrl } from "@/config"
import { Iconify } from "@/components/Iconify"
import { AnimatePresence, m } from "framer-motion"
import { animateFade } from "@/animate/fade"
import { ReviewForm } from "@/hooks/useReviewForm"
import { useOptionalUser } from "@/hooks/useUser"

interface Props {
  reviewForm: ReviewForm
  toolbarDisabled?: boolean
  toolbarElement?: JSX.Element | null
}

export const Recording = forwardRef<HTMLDivElement, PropsWithChildren<Props>>(
  ({ reviewForm, children, toolbarElement, toolbarDisabled }, ref) => {
    const { selectedComment, form } = reviewForm
    const user = useOptionalUser()

    const readOnly = Boolean(
      !user || (selectedComment && selectedComment.userId !== user.id),
    )

    return (
      <>
        <Toolbar disabled={toolbarDisabled} reviewForm={reviewForm}>
          {toolbarElement}
        </Toolbar>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexGrow="1"
          ref={ref}
        >
          {children}
        </Box>
      </>
    )
  },
)

Recording.displayName = "Recording"
