import { useEffect, useRef, useState } from "react"

interface UsePollingOptions<T> {
  interval?: number
  retries?: number
  poll: () => Promise<T>
  condition?: (value: T) => boolean
  onCondition?: () => void
  onRetriesExceeded?: () => void
  initialResult: T
}

export function usePolling<T>(options: UsePollingOptions<T>) {
  const initialRetries = options.retries ?? 3
  const [polling, setPolling] = useState(false)
  const [result, setResult] = useState<T>(options.initialResult)
  const retries = useRef(initialRetries)
  const timeoutHandle = useRef<NodeJS.Timeout>()

  useEffect(() => {
    function clearTimeoutHandle() {
      if (timeoutHandle.current) {
        clearTimeout(timeoutHandle.current)
        timeoutHandle.current = undefined
      }
    }

    async function poll() {
      setResult(await options.poll())

      timeoutHandle.current = setTimeout(
        () => (retries.current = retries.current - 1),
        options.interval ?? 1000
      )
    }

    if (!polling) {
      clearTimeoutHandle()
      retries.current = initialRetries
      return
    }

    if (options.condition && options.condition(result)) {
      setPolling(false)
      options.onCondition?.()
      return
    }

    if (retries.current === 0) {
      setPolling(false)
      options.onRetriesExceeded?.()
      return
    }

    poll()

    return clearTimeoutHandle
  }, [polling, options, result, initialRetries])

  return {
    polling,
    result,
    setPolling,
  }
}
