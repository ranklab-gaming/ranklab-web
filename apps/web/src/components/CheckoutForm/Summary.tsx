import { Iconify } from "@/components/Iconify"
import { formatPrice } from "@/utils/formatPrice"
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material"

type Props = {
  total: number
  discount?: number
  subtotal: number
  shipping?: number
  onEdit?: VoidFunction
  enableEdit?: boolean
  onApplyDiscount?: (discount: number) => void
  enableDiscount?: boolean
}

export function CheckoutFormSummary({
  total,
  onEdit,
  discount,
  subtotal,
  shipping,
  onApplyDiscount,
  enableEdit = false,
  enableDiscount = false,
}: Props) {
  const displayShipping = shipping !== null ? "Free" : "-"

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="Order Summary"
        action={
          enableEdit && (
            <Button
              size="small"
              onClick={onEdit}
              startIcon={<Iconify icon={"eva:edit-fill"} />}
            >
              Edit
            </Button>
          )
        }
      />

      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Sub Total
            </Typography>
            <Typography variant="subtitle2">{formatPrice(subtotal)}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Discount
            </Typography>
            <Typography variant="subtitle2">
              {discount ? formatPrice(-discount) : "-"}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Shipping
            </Typography>
            <Typography variant="subtitle2">
              {shipping ? formatPrice(shipping) : displayShipping}
            </Typography>
          </Stack>

          <Divider />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">Total</Typography>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="subtitle1" sx={{ color: "error.main" }}>
                {formatPrice(total)}
              </Typography>
              <Typography variant="caption" sx={{ fontStyle: "italic" }}>
                (VAT included if applicable)
              </Typography>
            </Box>
          </Stack>

          {enableDiscount && onApplyDiscount && (
            <TextField
              fullWidth
              placeholder="Discount codes / Gifts"
              value="DISCOUNT5"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={() => onApplyDiscount(5)}
                      sx={{ mr: -0.5 }}
                    >
                      Apply
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
