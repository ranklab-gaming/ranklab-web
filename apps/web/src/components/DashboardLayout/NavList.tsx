import { ReactElement, useState } from "react"
import { useRouter } from "next/router"
import { List, Collapse } from "@mui/material"
import {
  DashboardLayoutNavItemRoot,
  DashboardLayoutNavItemSub,
} from "./NavItem"

export type DashboardLayoutNavListProps = {
  title: string
  path: string
  icon?: ReactElement
  info?: ReactElement
  caption?: string
  disabled?: boolean
  roles?: string[]
  children?: {
    title: string
    path: string
    children?: { title: string; path: string }[]
  }[]
}

type NavListRootProps = {
  list: DashboardLayoutNavListProps
}

export function DashboardLayoutNavListRoot({ list }: NavListRootProps) {
  const { pathname } = useRouter()
  const active = list.path === pathname
  const [open, setOpen] = useState(active)
  const hasChildren = list.children

  if (hasChildren) {
    return (
      <>
        <DashboardLayoutNavItemRoot
          item={list}
          active={active}
          open={open}
          onOpen={() => setOpen(!open)}
        />
        <List component="div" disablePadding>
          {(list.children || []).map((item) => (
            <NavListSub key={item.title + item.path} list={item} />
          ))}
        </List>
      </>
    )
  }

  return <DashboardLayoutNavItemRoot item={list} active={active} />
}

type NavListSubProps = {
  list: DashboardLayoutNavListProps
}

function NavListSub({ list }: NavListSubProps) {
  const { pathname } = useRouter()
  const active = list.path === pathname
  const [open, setOpen] = useState(active)
  const hasChildren = list.children

  if (hasChildren) {
    return (
      <>
        <DashboardLayoutNavItemSub
          item={list}
          onOpen={() => setOpen(!open)}
          open={open}
          active={active}
        />
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 3 }}>
            {(list.children || []).map((item) => (
              <DashboardLayoutNavItemSub
                key={item.title + item.path}
                item={item}
                active={item.path === pathname}
              />
            ))}
          </List>
        </Collapse>
      </>
    )
  }

  return <DashboardLayoutNavItemSub item={list} active={active} />
}
