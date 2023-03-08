import { useEffect, useState } from "react"

export function useOffsetTop(isTop = 100) {
  const [offsetTop, setOffsetTop] = useState(false)

  useEffect(() => {
    window.onscroll = () => {
      if (window.pageYOffset > isTop) {
        setOffsetTop(true)
      } else {
        setOffsetTop(false)
      }
    }

    return () => {
      window.onscroll = null
    }
  }, [isTop])

  return offsetTop
}
