/**
 * Auth.js reads `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` via setEnvDefaults.
 * Many hosts and tutorials use `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` instead.
 * We accept either so the sign-in UI and provider stay in sync.
 */
export function readGoogleOAuthEnv(): { clientId: string; clientSecret: string } {
  const clientId =
    process.env.AUTH_GOOGLE_ID?.trim() ||
    process.env.GOOGLE_CLIENT_ID?.trim() ||
    process.env.GOOGLE_ID?.trim() ||
    ''
  const clientSecret =
    process.env.AUTH_GOOGLE_SECRET?.trim() ||
    process.env.GOOGLE_CLIENT_SECRET?.trim() ||
    process.env.GOOGLE_SECRET?.trim() ||
    ''
  return { clientId, clientSecret }
}

export function isGoogleOAuthConfigured(): boolean {
  const { clientId, clientSecret } = readGoogleOAuthEnv()
  return Boolean(clientId && clientSecret)
}
