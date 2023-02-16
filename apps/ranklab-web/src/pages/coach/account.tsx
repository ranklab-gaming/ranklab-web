import { capitalCase } from "change-case"
// @mui
import { Container, Tab, Box, Tabs } from "@mui/material"
// hooks
import useTabs from "@/hooks/useTabs"
// components
import Page from "@/components/Page"
import Iconify from "@/components/Iconify"
import { AccountBilling, AccountChangePassword } from "@/components/account"
import DashboardLayout from "../../layouts/dashboard"
import api from "@/api/server"
import { Game } from "@ranklab/api"
import { useRouter } from "next/router"
import AccountGeneral from "@/components/coach/AccountGeneral"
import withPageAuthRequired, {
  PropsWithSession,
} from "@/helpers/withPageAuthRequired"

// ----------------------------------------------------------------------

interface Props {
  games: Game[]
}

export const getServerSideProps = withPageAuthRequired({
  requiredUserType: "coach",
  fetchUser: true,
  getServerSideProps: async (ctx) => {
    const server = await api(ctx)
    const games = await server.gameList()

    return {
      props: {
        games,
      },
    }
  },
})

// ----------------------------------------------------------------------

export default function UserAccount({ games }: PropsWithSession<Props>) {
  const router = useRouter()
  const showBillingTab = router.query.show_billing === "true"
  const { currentTab, onChangeTab } = useTabs(
    showBillingTab ? "billing" : "general"
  )

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
  )
}
