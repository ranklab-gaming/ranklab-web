import { useCallback, useEffect, useRef, useState } from "react"

interface UsePollingOptions<T> {
  interval?: number
  retries?: number
  poll: () => Promise<T>
  condition?: (value: T) => boolean
  onCondition?: () => void
  onRetriesExceeded?: () => void
  initialResult: T
}

export function usePolling<T>(initialOptions: UsePollingOptions<T>) {
  const { current: options } = useRef(initialOptions)
  const [polling, setPolling] = useState(false)
  const [result, setResult] = useState<T>(options.initialResult)

  const handleSetPolling = useCallback(
    (value: boolean) => {
      let timeoutHandle: NodeJS.Timeout | null = null

      const startPolling = () => {
        let retries = options.retries ?? 3

        setPolling(true)

        const poll = async () => {
          if (retries === 0) {
            setPolling(false)
            options.onRetriesExceeded?.()
            return
          }

          const newResult = await options.poll()

          setResult(newResult)

          if (options.condition && options.condition(newResult)) {
            setPolling(false)
            options.onCondition?.()
            return
          }

          retries--
          timeoutHandle = setTimeout(poll, options.interval ?? 1000)
        }

        poll()
      }

      const stopPolling = () => {
        setPolling(false)

        if (timeoutHandle) {
          clearTimeout(timeoutHandle)
          timeoutHandle = null
        }
      }

      if (value) {
        startPolling()
      } else {
        stopPolling()
      }
    },
    [options]
  )

  return {
    polling,
    result,
    setPolling: handleSetPolling,
  }
}
