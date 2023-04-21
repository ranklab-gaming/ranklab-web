export function assertProp<T extends object, K extends keyof T>(
  obj: T | undefined | null,
  key: K,
  message?: string
): NonNullable<T[K]> {
  if (!obj || !obj[key]) {
    throw new Error(message ?? `expected ${String(key)} to be present`)
  }

  return obj[key] as NonNullable<T[K]>
}

export function assertFind<T>(
  array: T[],
  findFn: (item: T) => boolean,
  message?: string
): NonNullable<T> {
  const item = array.find(findFn)

  if (!item) {
    throw new Error(message ?? "expected array to contain item")
  }

  return item as NonNullable<T>
}
