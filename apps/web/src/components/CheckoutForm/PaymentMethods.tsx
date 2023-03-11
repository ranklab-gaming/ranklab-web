import { Controller, useForm } from "react-hook-form"
import { styled } from "@mui/material/styles"
import {
  Box,
  Card,
  Radio,
  Stack,
  Button,
  Collapse,
  TextField,
  Typography,
  RadioGroup,
  CardHeader,
  CardContent,
  FormHelperText,
  FormControlLabel,
} from "@mui/material"
import { PaymentOption, CardOption } from "../CheckoutForm"
import { Iconify } from "@/components/Iconify"
import { useResponsive } from "@/hooks/useResponsive"
import Image from "next/image"

const OptionStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 2.5),
  justifyContent: "space-between",
  transition: theme.transitions.create("all"),
  border: `solid 1px ${theme.palette.divider}`,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
}))

type Props = {
  paymentOptions: PaymentOption[]
  cardOptions: CardOption[]
}

export function CheckoutFormPaymentMethods({
  paymentOptions,
  cardOptions,
}: Props) {
  const isDesktop = useResponsive("up", "sm")
  const { control, formState, getValues, setValue } = useForm()

  return (
    <Card sx={{ my: 3 }}>
      <CardHeader title="Payment options" />
      <CardContent>
        <Controller
          name="payment"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <RadioGroup row {...field}>
                <Stack spacing={2}>
                  {paymentOptions.map((method) => {
                    const { value, title, icons, description } = method

                    const hasChildren = value === "credit_card"

                    const selected = field.value === value

                    return (
                      <OptionStyle
                        key={title}
                        sx={{
                          ...(selected && {
                            boxShadow: (theme) => theme.customShadows.z20,
                          }),
                          ...(hasChildren && { flexWrap: "wrap" }),
                        }}
                      >
                        <FormControlLabel
                          value={value}
                          control={
                            <Radio
                              checkedIcon={
                                <Iconify icon={"eva:checkmark-circle-2-fill"} />
                              }
                            />
                          }
                          label={
                            <Box sx={{ ml: 1 }}>
                              <Typography variant="subtitle2">
                                {title}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "text.secondary" }}
                              >
                                {description}
                              </Typography>
                            </Box>
                          }
                          sx={{ flexGrow: 1, py: 3 }}
                        />

                        {isDesktop && (
                          <Stack direction="row" spacing={1} flexShrink={0}>
                            {icons.map((icon) => (
                              <Image
                                key={icon}
                                alt="logo card"
                                src={icon}
                                width={30}
                                height={20}
                              />
                            ))}
                          </Stack>
                        )}

                        {hasChildren && (
                          <Collapse
                            in={field.value === "credit_card"}
                            sx={{ width: 1 }}
                          >
                            <TextField
                              select
                              fullWidth
                              label="Cards"
                              SelectProps={{ native: true }}
                            >
                              {cardOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </TextField>

                            <Button
                              size="small"
                              startIcon={
                                <Iconify
                                  icon={"eva:plus-fill"}
                                  width={20}
                                  height={20}
                                />
                              }
                              sx={{ my: 3 }}
                            >
                              Add new card
                            </Button>
                          </Collapse>
                        )}
                      </OptionStyle>
                    )
                  })}
                </Stack>
              </RadioGroup>

              {!!error && (
                <FormHelperText error sx={{ pt: 1, px: 2 }}>
                  {error.message}
                </FormHelperText>
              )}
            </>
          )}
        />
      </CardContent>
    </Card>
  )
}
