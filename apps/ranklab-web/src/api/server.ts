import { RanklabApi, Configuration } from "@ranklab/api"
import { GetServerSidePropsContext } from "next"
import { unstable_getServerSession } from "next-auth"
import { baseConfiguration } from "../api"
import { authOptions } from "../pages/api/auth/[...nextauth]"

export default async function server({
  req,
  res,
}: {
  req: GetServerSidePropsContext["req"]
  res: GetServerSidePropsContext["res"]
}) {
  const session = await unstable_getServerSession(req, res, authOptions)
  return apiWithAccessToken(session?.accessToken!)
}

export async function apiWithAccessToken(
  accessToken: string
): Promise<RanklabApi> {
  const configuration = new Configuration({
    ...baseConfiguration,
    fetchApi: fetch,
    basePath: process.env.API_HOST,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return new RanklabApi(configuration)
}
