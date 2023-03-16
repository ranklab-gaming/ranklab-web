import { useEffect, useState } from "react"

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
  const [polling, setPolling] = useState(false)
  const [result, setResult] = useState<T>(options.initialResult)
  const [retries, setRetries] = useState(options.retries ?? 3)
  const [timeoutHandle, setTimeoutHandle] = useState<NodeJS.Timeout>()

  function clearTimeoutHandle() {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle)
      setTimeoutHandle(undefined)
    }
  }

  async function poll() {
    setResult(await options.poll())

    setTimeoutHandle(
      setTimeout(() => setRetries(retries - 1), options.interval ?? 1000)
    )
  }

  useEffect(() => {
    if (!polling) {
      clearTimeoutHandle()
      return
    }

    if (options.condition && options.condition(result)) {
      setPolling(false)
      options.onCondition?.()
      return
    }

    if (retries === 0) {
      setPolling(false)
      options.onRetriesExceeded?.()
      return
    }

    poll()

    return clearTimeoutHandle
  }, [retries, polling])

  return {
    polling,
    result,
    setPolling,
  }
}
