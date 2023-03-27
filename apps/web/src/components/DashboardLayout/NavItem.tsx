import { Iconify } from "@/components/Iconify"
import { Box, Link, ListItemText, Tooltip, Typography } from "@mui/material"
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

export type NavItemProps = {
  item: NavListProps
  active?: boolean | undefined
  open?: boolean
  onOpen?: VoidFunction
  onMouseEnter?: VoidFunction
  onMouseLeave?: VoidFunction
}

export function NavItemRoot({
  item,
  open = false,
  active,
  onOpen,
}: NavItemProps) {
  const { title, icon, info, children, disabled, caption, roles } = item

  const renderContent = (
    <>
      {icon && <ListItemIconStyle>{icon}</ListItemIconStyle>}
      <ListItemTextStyle
        disableTypography
        primary={title}
        secondary={
          <Tooltip title={caption ?? ""} arrow>
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

  return "path" in item && item.path.startsWith("http") ? (
    <ListItem
      component={<Link />}
      href={item.path}
      target="_blank"
      rel="noopener"
      disabled={disabled}
      roles={roles}
    >
      {renderContent}
    </ListItem>
  ) : "path" in item ? (
    <NextLink href={item.path} passHref legacyBehavior>
      <ListItem activeRoot={active} disabled={disabled} roles={roles}>
        {renderContent}
      </ListItem>
    </NextLink>
  ) : (
    <ListItem
      onClick={item.action}
      activeRoot={active}
      disabled={disabled}
      roles={roles}
    >
      {renderContent}
    </ListItem>
  )
}

export function NavItemSub({
  item,
  open = false,
  active = false,
  onOpen,
}: NavItemProps) {
  const { title, info, children, disabled, caption, roles } = item

  const renderContent = (
    <>
      <DotIcon active={active} />
      <ListItemText
        disableTypography
        primary={title}
        secondary={
          <Tooltip title={caption ?? ""} arrow>
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

  return "path" in item && item.path.startsWith("http") ? (
    <ListItem
      component={<Link />}
      href={item.path}
      target="_blank"
      rel="noopener"
      subItem
      disabled={disabled}
      roles={roles}
    >
      {renderContent}
    </ListItem>
  ) : "path" in item ? (
    <NextLink href={item.path} passHref legacyBehavior>
      <ListItem activeSub={active} subItem disabled={disabled} roles={roles}>
        {renderContent}
      </ListItem>
    </NextLink>
  ) : (
    <ListItem
      onClick={item.action}
      activeSub={active}
      subItem
      disabled={disabled}
      roles={roles}
    >
      {renderContent}
    </ListItem>
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
