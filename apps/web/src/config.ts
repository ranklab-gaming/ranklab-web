export function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`environment variable ${name} is required`)
  }

  return value
}
