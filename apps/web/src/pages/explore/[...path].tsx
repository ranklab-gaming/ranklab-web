import type { GetServerSideProps } from "next"

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    redirect: {
      destination: ctx.resolvedUrl.replace("/explore", ""),
      permanent: true,
    },
  }
}

export default function () {
  return null
}
