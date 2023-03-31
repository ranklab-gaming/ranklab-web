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

export function usePolling<T>(initialOptions: UsePollingOptions<T>) {
  const { current: options } = useRef(initialOptions)
  const initialRetries = options.retries ?? 3
  const [polling, setPolling] = useState(false)
  const [result, setResult] = useState<T>(options.initialResult)
  const retries = useRef(initialRetries)
  const timeoutHandle = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const clearTimeoutHandle = () => {
      if (timeoutHandle.current) {
        clearTimeout(timeoutHandle.current)
        timeoutHandle.current = undefined
      }
    }

    const poll = async () => {
      if (!polling) {
        clearTimeoutHandle()
        retries.current = initialRetries
        return
      }

      if (retries.current === 0) {
        setPolling(false)
        options.onRetriesExceeded?.()
        return
      }

      setResult(await options.poll())
      retries.current--
      timeoutHandle.current = setTimeout(poll, options.interval ?? 1000)
    }

    poll()

    return clearTimeoutHandle
  }, [initialRetries, options, polling])

  useEffect(() => {
    if (options.condition && options.condition(result)) {
      setPolling(false)
      options.onCondition?.()
      return
    }
  }, [options, result])

  return {
    polling,
    result,
    setPolling,
  }
}
