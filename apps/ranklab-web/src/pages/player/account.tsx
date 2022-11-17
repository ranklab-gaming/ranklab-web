import { capitalCase } from "change-case"
// @mui
import { Container, Tab, Box, Tabs } from "@mui/material"
// hooks
import useTabs from "@ranklab/web/hooks/useTabs"
// components
import Page from "@ranklab/web/components/Page"
import Iconify from "@ranklab/web/components/Iconify"
import {
  AccountBilling,
  AccountChangePassword,
} from "@ranklab/web/components/account"
import DashboardLayout from "../../layouts/dashboard"
import { GetServerSideProps } from "next"
import withPageOnboardingRequired, {
  Props as PropsWithAuth,
} from "../../helpers/withPageOnboardingRequired"
import { UserProvider } from "../../contexts/UserContext"
import api from "@ranklab/web/api"
import { Game } from "@ranklab/api"
import AccountGeneral from "@ranklab/web/components/player/AccountGeneral"

// ----------------------------------------------------------------------

interface Props {
  games: Game[]
}

export const getServerSideProps: GetServerSideProps<PropsWithAuth<Props>> =
  async function (ctx) {
    const res = await withPageOnboardingRequired("player")(ctx)

    if ("redirect" in res || "notFound" in res) {
      return res
    }

    const { auth } = await res.props
    const games = await (await api.server(ctx)).gameList()

    return {
      props: {
        auth,
        games,
      },
    }
  }

// ----------------------------------------------------------------------

export default function UserAccount({ auth, games }: PropsWithAuth<Props>) {
  const { currentTab, onChangeTab } = useTabs("general")

  const ACCOUNT_TABS = [
    {
      value: "general",
      icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
      component: <AccountGeneral games={games} />,
    },
    {
      value: "billing",
      icon: <Iconify icon={"ic:round-receipt"} width={20} height={20} />,
      component: <AccountBilling />,
    },
    {
      value: "change_password",
      icon: <Iconify icon={"ic:round-vpn-key"} width={20} height={20} />,
      component: <AccountChangePassword />,
    },
  ]

  return (
    <UserProvider user={auth.user}>
      <DashboardLayout>
        <Page title="Account | Ranklab">
          <Container maxWidth="lg">
            <Tabs
              allowScrollButtonsMobile
              variant="scrollable"
              scrollButtons="auto"
              value={currentTab}
              onChange={onChangeTab}
            >
              {ACCOUNT_TABS.map((tab) => (
                <Tab
                  disableRipple
                  key={tab.value}
                  label={capitalCase(tab.value)}
                  icon={tab.icon}
                  value={tab.value}
                />
              ))}
            </Tabs>

            <Box sx={{ mb: 5 }} />

            {ACCOUNT_TABS.map((tab) => {
              const isMatched = tab.value === currentTab
              return isMatched && <Box key={tab.value}>{tab.component}</Box>
            })}
          </Container>
        </Page>
      </DashboardLayout>
    </UserProvider>
  )
}
