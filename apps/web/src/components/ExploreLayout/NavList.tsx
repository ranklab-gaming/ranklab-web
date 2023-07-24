import { useRouter } from "next/router"
import { ReactElement } from "react"
import { NavItemRoot } from "./NavItem"

export type NavListProps = {
  title: string
  icon?: ReactElement
} & (
  | {
      path: string
    }
  | {
      action: () => void
      active?: boolean
    }
)

type NavListRootProps = {
  list: NavListProps
  collapsed: boolean
}

export const NavListRoot = ({ list, collapsed }: NavListRootProps) => {
  const { asPath } = useRouter()

  return (
    <NavItemRoot
      item={list}
      active={"path" in list ? list.path === asPath : Boolean(list.active)}
      collapsed={collapsed}
    />
  )
}
