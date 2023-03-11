import { Review } from "@ranklab/api"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Grid } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { CheckoutFormSummary } from "./CheckoutForm/Summary"
import { CheckoutFormPaymentMethods } from "./CheckoutForm/PaymentMethods"

interface Props {
  review: Review
}

export type PaymentType = "paypal" | "credit_card" | "cash"

export type ProductStatus = "sale" | "new" | ""

export type ProductInventoryType = "in_stock" | "out_of_stock" | "low_stock"

export type ProductCategory = "Accessories" | "Apparel" | "Shoes" | string

export type ProductGender = "Men" | "Women" | "Kids" | string

export type OnCreateBilling = (address: BillingAddress) => void

export type ProductRating = {
  name: string
  starCount: number
  reviewCount: number
}

export type ProductReview = {
  id: string
  name: string
  avatarUrl: string
  comment: string
  rating: number
  isPurchased: boolean
  helpful: number
  postedAt: Date | string | number
}

export type Product = {
  id: string
  cover: string
  images: string[]
  name: string
  price: number
  code: string
  sku: string
  tags: string[]
  priceSale: number | null
  totalRating: number
  totalReview: number
  ratings: ProductRating[]
  reviews: ProductReview[]
  colors: string[]
  status: ProductStatus
  inventoryType: ProductInventoryType
  sizes: string[]
  available: number
  description: string
  sold: number
  createdAt: Date | string | number
  category: ProductCategory
  gender: ProductGender
}

export type CartItem = {
  id: string
  name: string
  cover: string
  available: number
  price: number
  color: string
  size: string
  quantity: number
  subtotal: number
}

export type BillingAddress = {
  receiver: string
  phone: string
  fullAddress: string
  addressType: string
  isDefault: boolean
}

export type ProductState = {
  isLoading: boolean
  error: Error | string | null
  products: Product[]
  product: Product | null
  sortBy: string | null
  filters: {
    gender: string[]
    category: string
    colors: string[]
    priceRange: string
    rating: string
  }
  checkout: {
    activeStep: number
    cart: CartItem[]
    subtotal: number
    total: number
    discount: number
    shipping: number
    billing: BillingAddress | null
  }
}

export type ProductFilter = {
  gender: string[]
  category: string
  colors: string[]
  priceRange: string
  rating: string
}

export type DeliveryOption = {
  value: number
  title: string
  description: string
}

export type PaymentOption = {
  value: PaymentType
  title: string
  description: string
  icons: string[]
}

export type CardOption = {
  value: string
  label: string
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    value: "credit_card",
    title: "Credit / Debit Card",
    description: "We support Mastercard, Visa, Discover and Stripe.",
    icons: [
      "https://minimal-assets-api-dev.vercel.app/assets/icons/ic_mastercard.svg",
      "https://minimal-assets-api-dev.vercel.app/assets/icons/ic_visa.svg",
    ],
  },
]

const CARDS_OPTIONS: CardOption[] = [
  { value: "ViSa1", label: "**** **** **** 1212 - Jimmy Holland" },
  { value: "ViSa2", label: "**** **** **** 2424 - Shawn Stokes" },
  { value: "MasterCard", label: "**** **** **** 4545 - Cole Armstrong" },
]

type FormValuesProps = {
  payment: string
}

export function CheckoutForm(props: Props) {
  const { total, discount, subtotal, shipping } = {
    total: 0,
    discount: 0,
    subtotal: 0,
    shipping: 0,
  }

  const PaymentSchema = Yup.object().shape({
    payment: Yup.string().required("Payment is required!"),
  })

  const defaultValues = {
    payment: "",
  }

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver<Yup.ObjectSchema<any>>(PaymentSchema),
    defaultValues,
  })

  const {
    formState: { isSubmitting },
  } = methods

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <CheckoutFormPaymentMethods
          cardOptions={CARDS_OPTIONS}
          paymentOptions={PAYMENT_OPTIONS}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <CheckoutFormSummary
          enableEdit
          total={total}
          subtotal={subtotal}
          discount={discount}
          shipping={shipping}
        />
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Complete Order
        </LoadingButton>
      </Grid>
    </Grid>
  )
}
