import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGoogleAuthMutation } from '../store/api/authApi'
import { ROUTES } from '../constants'

export default function GoogleCallbackPage({ showAlert }) {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [googleAuth] = useGoogleAuthMutation()
    const called = useRef(false)

    useEffect(() => {
        if (called.current) return
        called.current = true

        const code = searchParams.get('code')
        if (!code) {
            showAlert('Google authentication failed — no code received', 'danger')
            navigate(ROUTES.LOGIN, { replace: true })
            return
        }

        googleAuth({ code })
            .unwrap()
            .then(() => {
                showAlert('Signed in with Google', 'success')
                navigate(ROUTES.HOME, { replace: true })
            })
            .catch((err) => {
                showAlert(err.data?.detail || 'Google authentication failed', 'danger')
                navigate(ROUTES.LOGIN, { replace: true })
            })
    }, [])

    return (
        <div className="auth-page">
            <div className="auth-card" style={{ textAlign: 'center' }}>
                <h2 className="auth-title">Signing you in...</h2>
                <p className="auth-subtitle">Please wait while we complete Google authentication.</p>
            </div>
        </div>
    )
}
