export default function OidcInteractionPage() {
  return (
    <form method="post" action="/api/oidc/login/finish">
      <button type="submit">Login</button>
    </form>
  )
}
