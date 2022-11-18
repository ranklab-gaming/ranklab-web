export default function AuthInteractionPage() {
  return (
    <form method="post" action="/auth/login/finish">
      <button type="submit">Login</button>
    </form>
  )
}
