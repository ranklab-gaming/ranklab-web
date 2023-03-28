import { Collapse, List } from "@mui/material"
import { useRouter } from "next/router"
import { ReactElement, useState } from "react"
import { NavItemRoot, NavItemSub } from "./NavItem"

export type NavListProps = {
  title: string
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

  const active =
    ("path" in list && list.path === pathname) ||
    ("active" in list && list.active)

  const [open, setOpen] = useState(active)
  const hasChildren = list.children

  if (hasChildren) {
    return (
      <>
        <NavItemRoot
          item={list}
          active={active}
          open={open}
          onOpen={() => setOpen(!open)}
        />
        <List component="div" disablePadding>
          {(list.children ?? []).map((item, index) => (
            <NavListSub key={index} list={item} />
          ))}
        </List>
      </>
    )
  }

  return <NavItemRoot item={list} active={active} />
}

type NavListSubProps = {
  list: NavListProps
}

const NavListSub = ({ list }: NavListSubProps) => {
  const { pathname } = useRouter()

  const active =
    ("path" in list && list.path === pathname) ||
    ("active" in list && list.active)

  const [open, setOpen] = useState(active)
  const hasChildren = list.children

  if (hasChildren) {
    return (
      <>
        <NavItemSub
          item={list}
          onOpen={() => setOpen(!open)}
          open={open}
          active={active}
        />
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 3 }}>
            {(list.children ?? []).map((item) => (
              <NavItemSub
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

  return <NavItemSub item={list} active={active} />
}
