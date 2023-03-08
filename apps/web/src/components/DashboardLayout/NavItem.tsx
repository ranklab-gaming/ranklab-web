import { Iconify } from "@/components/Iconify"
import { Box, Link, ListItemText, Tooltip, Typography } from "@mui/material"
import NextLink from "next/link"
import { forwardRef } from "react"
import {
  DashboardLayoutListItemStyle, DashboardLayoutListItemStyleProps, ListItemIconStyle, ListItemTextStyle
} from "./ListItemStyle"
import { DashboardLayoutNavListProps } from "./NavList"

const ListItem = forwardRef<
  HTMLButtonElement & HTMLAnchorElement & HTMLDivElement,
  DashboardLayoutListItemStyleProps
>((props, ref) => {
  return (
    <DashboardLayoutListItemStyle {...props} ref={ref}>
      {props.children}
    </DashboardLayoutListItemStyle>
  )
})

export type DashboardLayoutNavItemProps = {
  item: DashboardLayoutNavListProps
  active?: boolean | undefined
  open?: boolean
  onOpen?: VoidFunction
  onMouseEnter?: VoidFunction
  onMouseLeave?: VoidFunction
}

export function DashboardLayoutNavItemRoot({
  item,
  open = false,
  active,
  onOpen,
}: DashboardLayoutNavItemProps) {
  const { title, path, icon, info, children, disabled, caption, roles } = item

  const renderContent = (
    <>
      {icon && <ListItemIconStyle>{icon}</ListItemIconStyle>}
      <ListItemTextStyle
        disableTypography
        primary={title}
        secondary={
          <Tooltip title={caption || ""} arrow>
            <Typography
              noWrap
              variant="caption"
              component="div"
              sx={{ textTransform: "initial", color: "text.secondary" }}
            >
              {caption}
            </Typography>
          </Tooltip>
        }
      />
      {info && info}
      {children && <ArrowIcon open={open} />}
    </>
  )

  if (children) {
    return (
      <ListItem
        onClick={onOpen}
        activeRoot={active}
        disabled={disabled}
        roles={roles}
      >
        {renderContent}
      </ListItem>
    )
  }

  return path.startsWith("http") ? (
    <ListItem
      component={<Link />}
      href={path}
      target="_blank"
      rel="noopener"
      disabled={disabled}
      roles={roles}
    >
      {renderContent}
    </ListItem>
  ) : (
    <NextLink href={path} passHref legacyBehavior>
      <ListItem activeRoot={active} disabled={disabled} roles={roles}>
        {renderContent}
      </ListItem>
    </NextLink>
  )
}

export function DashboardLayoutNavItemSub({
  item,
  open = false,
  active = false,
  onOpen,
}: DashboardLayoutNavItemProps) {
  const { title, path, info, children, disabled, caption, roles } = item

  const renderContent = (
    <>
      <DotIcon active={active} />
      <ListItemText
        disableTypography
        primary={title}
        secondary={
          <Tooltip title={caption || ""} arrow>
            <Typography
              noWrap
              variant="caption"
              component="div"
              sx={{ textTransform: "initial", color: "text.secondary" }}
            >
              {caption}
            </Typography>
          </Tooltip>
        }
      />
      {info && info}
      {children && <ArrowIcon open={open} />}
    </>
  )

  if (children) {
    return (
      <ListItem
        onClick={onOpen}
        activeSub={active}
        subItem
        disabled={disabled}
        roles={roles}
      >
        {renderContent}
      </ListItem>
    )
  }

  return path.startsWith("http") ? (
    <ListItem
      component={<Link />}
      href={path}
      target="_blank"
      rel="noopener"
      subItem
      disabled={disabled}
      roles={roles}
    >
      {renderContent}
    </ListItem>
  ) : (
    <NextLink href={path} passHref legacyBehavior>
      <ListItem activeSub={active} subItem disabled={disabled} roles={roles}>
        {renderContent}
      </ListItem>
    </NextLink>
  )
}

type DotIconProps = {
  active: boolean
}

export function DotIcon({ active }: DotIconProps) {
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

type ArrowIconProps = {
  open: boolean
}

function ArrowIcon({ open }: ArrowIconProps) {
  return (
    <Iconify
      icon={open ? "eva:arrow-ios-downward-fill" : "eva:arrow-ios-forward-fill"}
      sx={{ width: 16, height: 16, ml: 1 }}
    />
  )
}
