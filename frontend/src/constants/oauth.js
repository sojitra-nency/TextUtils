/**
 * Google OAuth configuration.
 * GOOGLE_CLIENT_ID must be set in your .env as VITE_GOOGLE_CLIENT_ID.
 */

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
const REDIRECT_URI = `${window.location.origin}/auth/google/callback`

const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
})

export const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
