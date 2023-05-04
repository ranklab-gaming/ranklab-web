function moveTurn(move: any) {
  return Math.floor((move.ply - 1) / 2) + 1
}

export function formatMove(move: any) {
  return `${moveTurn(move)}. ${move?.san}`
}
