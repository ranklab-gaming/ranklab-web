import { Link } from "@mui/material"
import NextLink from "next/link"
import { forwardRef } from "react"
import {
  ListItemStyle,
  ListItemStyleProps,
  ListItemIconStyle,
  ListItemTextStyle,
} from "./ListItemStyle"
import { NavListProps } from "./NavList"

const ListItem = forwardRef<
  HTMLButtonElement & HTMLAnchorElement & HTMLDivElement,
  ListItemStyleProps
>((props, ref) => {
  return (
    <ListItemStyle {...props} ref={ref}>
      {props.children}
    </ListItemStyle>
  )
})

ListItem.displayName = "ListItem"

interface NavItemProps {
  item: NavListProps
  active: boolean
  collapsed: boolean
}

export const NavItemRoot = ({ item, active, collapsed }: NavItemProps) => {
  const { title, icon } = item
  const renderIcon = icon ? (
    <ListItemIconStyle collapsed={collapsed}>{icon}</ListItemIconStyle>
  ) : null

  const renderContent = collapsed ? (
    renderIcon
  ) : (
    <>
      {renderIcon}
      <ListItemTextStyle disableTypography primary={title} title={title} />
    </>
  )

  if ("path" in item) {
    if (item.path.startsWith("http")) {
      return (
        <ListItem
          component={<Link />}
          href={item.path}
          target="_blank"
          rel="noopener"
          collapsed={collapsed}
        >
          {renderContent}
        </ListItem>
      )
    }

    return (
      <NextLink href={item.path} passHref legacyBehavior>
        <ListItem activeRoot={active} collapsed={collapsed}>
          {renderContent}
        </ListItem>
      </NextLink>
    )
  }

  return (
    <ListItem onClick={item.action} activeRoot={active} collapsed={collapsed}>
      {renderContent}
    </ListItem>
  )
}
