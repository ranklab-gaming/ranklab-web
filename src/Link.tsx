import React, { ForwardedRef } from "react"
import clsx from "clsx"
import { useRouter } from "next/router"
import NextLink from "next/link"
import MuiLink from "@material-ui/core/Link"

interface NextComposedProps {
  as: string
  href: string
  prefetch: boolean
  className: string
}

const NextComposed = React.forwardRef<
  HTMLAnchorElement,
  React.PropsWithChildren<NextComposedProps>
>(function NextComposed(props, ref) {
  const { as, href, ...other } = props

  return (
    <NextLink href={href} as={as}>
      <a ref={ref} {...other} />
    </NextLink>
  )
})

// A styled version of the Next.js Link component:
// https://nextjs.org/docs/#with-link
const Link: React.FC<LinkProps> = function (props) {
  const {
    href,
    activeClassName = "active",
    className: classNameProps,
    innerRef,
    naked,
    ...other
  } = props

  const router = useRouter()
  const pathname = href
  const className = clsx(classNameProps, {
    [activeClassName]: router.pathname === pathname && activeClassName,
  })

  if (naked) {
    return (
      <NextComposed
        className={className}
        ref={innerRef}
        href={href}
        {...other}
      />
    )
  }

  return (
    <MuiLink
      component={NextComposed}
      className={className}
      ref={innerRef}
      href={href}
      {...other}
    />
  )
}

interface LinkProps {
  activeClassName: string
  as: string
  className: string
  href: string
  innerRef: ForwardedRef<HTMLAnchorElement>
  naked: boolean
  onClick: () => void
  prefetch: boolean
  color: string
}

export default React.forwardRef<
  HTMLAnchorElement,
  React.PropsWithChildren<LinkProps>
>((props, ref) => <Link {...props} innerRef={ref} />)
