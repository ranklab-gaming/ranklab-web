interface Props {
  src: string
}

export function Video({ src }: Props) {
  return (
    <>
      <video
        src={src}
        controls
        style={{
          width: "100%",
        }}
      />
    </>
  )
}
