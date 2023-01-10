import { styled } from "@mui/material/styles"
import MinimalLayout from "@ranklab/web/src/layouts/minimal"
import Page from "@ranklab/web/src/components/Page"
import { useEffect } from "react"
import { GlobalStyles } from "@mui/material"

const RootStyle = styled(Page)(() => ({
  display: "flex",
  minHeight: "100%",
  alignItems: "center",
  flexDirection: "column",
}))

export default function TermsAndConditions() {
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://cdn.iubenda.com/iubenda.js"
    script.async = true
    document.body.appendChild(script)
  })

  return (
    <MinimalLayout>
      <GlobalStyles
        styles={{
          "#iub-pp-container": {
            p: { lineHeight: 1.6, paddingTop: 15 },
            h1: { marginBottom: 20, marginTop: 20 },
            h2: { marginBottom: 20, marginTop: 20 },
            h3: { marginBottom: 20, marginTop: 20 },
            h4: { marginBottom: 20, marginTop: 20 },
            ul: { marginLeft: 20, marginBottom: 20 },
          },
        }}
      />
      <RootStyle title="Terms and Conditions | Ranklab">
        <div>
          <a
            href="https://www.iubenda.com/terms-and-conditions/88772361"
            className="iubenda-nostyle no-brand iubenda-noiframe iubenda-embed iub-no-markup iubenda-noiframe iub-body-embed"
            title="Terms and Conditions"
          >
            Terms and Conditions
          </a>
        </div>

        <div>
          <h2 style={{ marginTop: 20, marginBottom: 20 }}>
            Additional Refund Terms
          </h2>

          <p>
            Once you make payment to get your game reviewed you will be able to
            get a refund of your order until a coach starts the review process.
            Once a coach completes the review you will have 5 days to ask for a
            refund if you're not satisfied with the review. The result of your
            refund request will be up to our discretion.
          </p>
        </div>
      </RootStyle>
    </MinimalLayout>
  )
}
