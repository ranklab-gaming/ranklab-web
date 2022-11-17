export default function AuthInteractionPage() {
  return (
    <form method="post" action="/api/oidc/login">
      <button type="submit">Login</button>
    </form>
  )
}
