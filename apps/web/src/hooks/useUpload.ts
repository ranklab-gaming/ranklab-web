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
  file: File
  url: string
  headers?: Headers
  method?: string
}

export type UseUploadState = {
  uploading: boolean
  progress: number
}

export type UploadFunction = (data: UploadProps) => Promise<void>
export type UseUploadResults = [UploadFunction, UseUploadState]

export const useUpload = (): UseUploadResults => {
  const [state, setState] = useState<UseUploadState>({
    uploading: false,
    progress: 0,
  })

  const upload = async ({ file, headers, method, url }: UploadProps) => {
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

    return new Promise<void>((resolve, reject) => {
      xhr.addEventListener("load", () => {
        setState({ uploading: false, progress: 0 })
        resolve()
      })

      xhr.addEventListener("error", (error) => {
        setState({ uploading: false, progress: 0 })
        reject(error)
      })

      xhr.addEventListener("abort", (error) => {
        setState({ uploading: false, progress: 0 })
        reject(error)
      })

      xhr.send(file)
    })
  }

  return [upload, state]
}
