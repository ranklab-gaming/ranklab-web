import { useState } from "react"

type Headers = {
  [key: string]: string
}

export type RequestOptions = {
  method: string
  url: string
  headers?: Headers
  body: Document | XMLHttpRequestBodyInit | null | undefined
}

export type UploadProps = {
  onDone?: () => void
  onError?: (error: ProgressEvent) => void
  onAbort?: () => void
  file: File
  url: string
  headers?: Headers
  method?: string
}

export type UseUploadState = {
  uploading: boolean
  progress: number
}

export type UploadFunction = (data: UploadProps) => void
export type UseUploadResults = [UploadFunction, UseUploadState]

export const useUpload = (): UseUploadResults => {
  const [state, setState] = useState<UseUploadState>({
    uploading: false,
    progress: 0,
  })

  const upload = async ({
    file,
    headers,
    method,
    url,
    onDone,
    onAbort,
    onError,
  }: UploadProps) => {
    setState({ uploading: true, progress: 0 })

    const xhr = new XMLHttpRequest()

    xhr.open(method ?? "PUT", url)

    if (headers) {
      Object.keys(headers).forEach((header) =>
        xhr.setRequestHeader(header, headers[header])
      )
    }

    xhr.upload.addEventListener("progress", (event) => {
      setState((state) => ({
        ...state,
        progress: Math.round((event.loaded / event.total) * 100),
      }))
    })

    xhr.addEventListener("load", () => {
      setState({ uploading: false, progress: 0 })
      onDone?.()
    })

    xhr.addEventListener("error", (error) => {
      setState({ uploading: false, progress: 0 })
      onError?.(error)
    })

    xhr.addEventListener("abort", () => {
      setState({ uploading: false, progress: 0 })
      onAbort?.()
    })

    xhr.send(file)
  }

  return [upload, state]
}
