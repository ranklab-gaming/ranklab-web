interface Props {
  src: string
}

export const Video = ({ src }: Props) => {
  return (
    <video
      src={src}
      controls
      style={{
        width: "100%",
      }}
    />
  )
}
