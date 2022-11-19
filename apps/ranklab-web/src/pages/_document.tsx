import { Children } from "react"
import NextDocument, { Html, Head, Main, NextScript } from "next/document"
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import createEmotionServer from "@emotion/server/create-instance"
import palette from "../theme/palette"

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <link rel="manifest" href="/assets/manifest.json" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/assets/favicon/apple-touch-icon.png"
          />

          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/assets/favicon/favicon-32x32.png"
          />

          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/assets/favicon/favicon-16x16.png"
          />

          <link
            href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />

          <meta name="description" content="The Ranklab coaching platform" />
          <meta name="author" content="Ranklab Ltd" />
          <meta name="theme-color" content={palette.light.primary.main} />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

Document.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage
  const cache = createCache({ key: "css" })
  const { extractCriticalToChunks } = createEmotionServer(cache)

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) =>
        (
          <CacheProvider value={cache}>
            <App {...props} />
          </CacheProvider>
        ),
    })

  const initialProps = await NextDocument.getInitialProps(ctx)
  const emotionStyles = extractCriticalToChunks(initialProps.html)

  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ))

  return {
    ...initialProps,
    styles: [...Children.toArray(initialProps.styles), ...emotionStyleTags],
  }
}
