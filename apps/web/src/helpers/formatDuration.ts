export function formatDuration(duration: number, showHours = true) {
  const minutes = Math.floor((duration % 3600) / 60)
  const seconds = Math.floor(duration % 60)

  const parts = [minutes, seconds]

  if (showHours) {
    const hours = Math.floor(duration / 3600)
    parts.unshift(hours)
  }

  return parts.map((v) => v.toString().padStart(2, "0")).join(":")
}
