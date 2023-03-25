export function formatDuration(duration: number) {
  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)
  const seconds = Math.floor(duration % 60)

  return [hours, minutes, seconds]
    .map((v) => v.toString().padStart(2, "0"))
    .join(":")
}
