import { AppProps } from "@/pages/_app"
import { createEmotionCache } from "@/styles"
import createEmotionServer from "@emotion/server/create-instance"
import NextDocument, {
  DocumentContext,
  DocumentProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document"

export default function Document({ styles }: DocumentProps) {
  return (
    <Html lang="en">
      <Head>{styles}</Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

Document.getInitialProps = async function (ctx: DocumentContext) {
  const { renderPage } = ctx
  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)

  ctx.renderPage = () =>
    renderPage({
      enhanceApp: (App) => (props: AppProps) =>
        <App emotionCache={cache} {...props} />,
    })

  const initialProps = await NextDocument.getInitialProps(ctx)
  const { styles } = extractCriticalToChunks(initialProps.html)

  return {
    ...initialProps,
    styles: styles.map((style) => (
      <style
        data-emotion={`${style.key} ${style.ids.join(" ")}`}
        key={style.key}
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    )),
  }
}
