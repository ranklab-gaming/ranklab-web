import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import React from "react"
import MainLayout from "src/layouts/main"

export const getServerSideProps = withPageAuthRequired()

function DashboardPage() {
  return <MainLayout>Dashboard.</MainLayout>
}

export default DashboardPage
