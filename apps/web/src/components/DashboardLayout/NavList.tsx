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
}

export const NavListRoot = ({ list }: NavListRootProps) => {
  const { pathname } = useRouter()

  return (
    <NavItemRoot
      item={list}
      active={"path" in list ? list.path === pathname : list.active}
    />
  )
}
