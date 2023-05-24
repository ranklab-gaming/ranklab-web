import { BasicLayout } from "@/components/BasicLayout"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  useTheme,
} from "@mui/material"
import { PropsWithChildren, useId } from "react"
import Sticky from "react-stickynode"
import { assetsCdnUrl } from "@/config"
import { FieldValues, UseFormReturn } from "react-hook-form"
import { useResponsive } from "@/hooks/useResponsive"

interface SignupPageProps<T extends FieldValues> {
  title: string
  form: UseFormReturn<T>
  onSubmit: (data: T) => Promise<void>
  reviewDemoKey: string
  reviewDemoTitle: string
  reviewDemoSubheader: string
}

export const SignupPage = <T extends FieldValues>({
  title,
  form,
  onSubmit,
  children,
  reviewDemoKey,
  reviewDemoTitle,
  reviewDemoSubheader,
}: PropsWithChildren<SignupPageProps<T>>) => {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form

  const theme = useTheme()
  const isDesktop = useResponsive("up", "sm")
  const id = useId().slice(1, -1)

  return (
    <BasicLayout title={title} maxWidth="lg">
      <form onSubmit={handleSubmit(onSubmit)} className={`${id}-form`}>
        <Stack spacing={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Stack spacing={3}>
                {children}
                <Box>
                  <LoadingButton
                    color="primary"
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    fullWidth={!isDesktop}
                    sx={{ minWidth: "150px" }}
                  >
                    Sign up
                  </LoadingButton>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Sticky
                enabled
                top={20}
                innerZ={9999}
                bottomBoundary={`.${id}-form`}
              >
                <Card elevation={4}>
                  <CardHeader
                    title={reviewDemoTitle}
                    subheader={reviewDemoSubheader}
                  />
                  <CardContent>
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                      key={reviewDemoKey}
                      style={{
                        maxWidth: "100%",
                        objectFit: "cover",
                        borderRadius: theme.shape.borderRadius,
                      }}
                    >
                      <source
                        src={`${assetsCdnUrl}/${reviewDemoKey}`}
                        type="video/mp4"
                      />
                    </video>
                  </CardContent>
                </Card>
              </Sticky>
            </Grid>
          </Grid>
        </Stack>
      </form>
    </BasicLayout>
  )
}
