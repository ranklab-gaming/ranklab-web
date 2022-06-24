import { capitalCase } from "change-case"
// @mui
import { Container, Tab, Box, Tabs } from "@mui/material"
// hooks
import useTabs from "@ranklab/web/hooks/useTabs"
// components
import Page from "@ranklab/web/components/Page"
import Iconify from "@ranklab/web/components/Iconify"
import {
  AccountGeneral,
  AccountBilling,
  AccountChangePassword,
} from "@ranklab/web/components/account"
import DashboardLayout from "../layouts/dashboard"
import { GetServerSideProps } from "next"
import withPageOnboardingRequired, {
  Props,
} from "../helpers/withPageOnboardingRequired"
import { UserProvider } from "../contexts/UserContext"

// ----------------------------------------------------------------------

UserAccount.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>
}

export const getServerSideProps: GetServerSideProps<Props<{}>> =
  async function (ctx) {
    const res = await withPageOnboardingRequired()(ctx)

    if ("redirect" in res || "notFound" in res) {
      return res
    }

    const { auth } = await res.props

    return {
      props: {
        auth,
      },
    }
  }

// ----------------------------------------------------------------------

export default function UserAccount({ auth }: Props<{}>) {
  const { currentTab, onChangeTab } = useTabs("general")

  const ACCOUNT_TABS = [
    {
      value: "general",
      icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
      component: <AccountGeneral />,
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
    </UserProvider>
  )
}
