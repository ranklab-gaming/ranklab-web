import { ReactNode } from "react"
//
import MainFooter from "./MainFooter"
import MainNavbar from "./MainNavbar"

// ----------------------------------------------------------------------

type MainLayoutProps = {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <MainNavbar />
      <div>{children}</div>
      <MainFooter />
    </>
  )
}
