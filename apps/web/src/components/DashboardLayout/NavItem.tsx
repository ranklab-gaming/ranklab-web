import { Box, Link, ListItemText } from "@mui/material"
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

export type NavItemProps = {
  item: NavListProps
  active?: boolean | undefined
}

export const NavItemRoot = ({ item, active }: NavItemProps) => {
  const { title, icon } = item

  const renderContent = (
    <>
      {icon ? <ListItemIconStyle>{icon}</ListItemIconStyle> : null}
      <ListItemTextStyle disableTypography primary={title} />
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
        >
          {renderContent}
        </ListItem>
      )
    }

    return (
      <NextLink href={item.path} passHref legacyBehavior>
        <ListItem activeRoot={active}>{renderContent}</ListItem>
      </NextLink>
    )
  }

  return (
    <ListItem onClick={item.action} activeRoot={active}>
      {renderContent}
    </ListItem>
  )
}

export const NavItemSub = ({ item, active = false }: NavItemProps) => {
  const { title } = item

  const renderContent = (
    <>
      <DotIcon active={active} />
      <ListItemText disableTypography primary={title} />
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
          subItem
        >
          {renderContent}
        </ListItem>
      )
    }

    return (
      <NextLink href={item.path} passHref legacyBehavior>
        <ListItem activeSub={active} subItem>
          {renderContent}
        </ListItem>
      </NextLink>
    )
  }

  return (
    <ListItem onClick={item.action} activeSub={active} subItem>
      {renderContent}
    </ListItem>
  )
}

type DotIconProps = {
  active: boolean
}

export const DotIcon = ({ active }: DotIconProps) => {
  return (
    <ListItemIconStyle>
      <Box
        component="span"
        sx={{
          width: 4,
          height: 4,
          borderRadius: "50%",
          bgcolor: "text.disabled",
          transition: (theme) =>
            theme.transitions.create("transform", {
              duration: theme.transitions.duration.shorter,
            }),
          ...(active && {
            transform: "scale(2)",
            bgcolor: "primary.main",
          }),
        }}
      />
    </ListItemIconStyle>
  )
}
