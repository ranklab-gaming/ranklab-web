import React, { forwardRef, useState } from "react"
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ButtonProps,
  IconButton,
} from "@mui/material"
import LoadingButton from "@mui/lab/LoadingButton"
import { useSnackbar } from "notistack"

interface ConfirmationButtonProps {
  buttonText?: string
  buttonIcon?: JSX.Element
  dialogTitle: string
  dialogContentText: string
  buttonProps?: ButtonProps
  action: () => Promise<void>
}

export const ConfirmationButton = forwardRef<
  HTMLButtonElement,
  ConfirmationButtonProps
>(
  (
    {
      buttonText,
      buttonIcon,
      dialogTitle,
      dialogContentText,
      buttonProps,
      action,
      ...other
    },
    ref
  ) => {
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const { enqueueSnackbar } = useSnackbar()

    const handleOpenDialog = () => {
      setShowDialog(true)
    }

    const handleCloseDialog = () => {
      setShowDialog(false)
    }

    const handleConfirm = async () => {
      setLoading(true)

      try {
        await action()
        setShowDialog(false)
      } catch (error) {
        enqueueSnackbar("An unexpected error occurred. Please try again.", {
          variant: "error",
        })

        throw error
      } finally {
        setLoading(false)
      }
    }

    const handleCancel = () => {
      setShowDialog(false)
    }

    return (
      <>
        {buttonText ? (
          <Button
            {...buttonProps}
            onClick={handleOpenDialog}
            ref={ref}
            {...other}
          >
            {buttonText}
          </Button>
        ) : buttonIcon ? (
          <IconButton
            {...buttonProps}
            onClick={handleOpenDialog}
            ref={ref}
            {...other}
          >
            {buttonIcon}
          </IconButton>
        ) : null}
        <Dialog open={showDialog} onClose={handleCloseDialog} fullWidth>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogContent sx={{ mt: 2, mb: 0, pb: 0 }}>
            <DialogContentText>{dialogContentText}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel}>Go Back</Button>
            <LoadingButton
              onClick={handleConfirm}
              autoFocus
              disabled={loading}
              loading={loading}
              color="primary"
              variant="contained"
            >
              Confirm
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </>
    )
  }
)

ConfirmationButton.displayName = "ConfirmationButton"
