// @mui
import { Box, Link, Typography } from "@mui/material"
import { OrderCompleteIllustration } from "@ranklab/web/assets"

// ----------------------------------------------------------------------

export default function CheckoutOrderComplete() {
  return (
    <Box sx={{ p: 4, maxWidth: 480, margin: "auto" }}>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h4" paragraph>
          Thank you for your purchase!
        </Typography>

        <OrderCompleteIllustration sx={{ height: 260, my: 10 }} />

        <Typography align="left" paragraph>
          Thanks for placing order &nbsp;
          <Link href="#">01dc1370-3df6-11eb-b378-0242ac130002</Link>
        </Typography>

        <Typography align="left" sx={{ color: "text.secondary" }}>
          We will send you a notification within 5 days when it ships.
          <br /> <br /> If you have any question or queries then fell to get in
          contact us. <br /> <br /> All the best,
        </Typography>
      </Box>
    </Box>
  )
}
