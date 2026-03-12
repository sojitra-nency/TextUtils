import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRegisterMutation } from '../store/api/authApi'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '../constants'
import { GOOGLE_AUTH_URL } from '../constants/oauth'

export default function SignupPage({ showAlert }) {
    const navigate = useNavigate()
    const { accessToken } = useSelector((s) => s.auth)
    const [register, { isLoading }] = useRegisterMutation()

    const [displayName, setDisplayName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    if (accessToken) return <Navigate to={ROUTES.HOME} replace />

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password.length < 8) {
            showAlert('Password must be at least 8 characters', 'danger')
            return
        }
        if (password !== confirmPassword) {
            showAlert('Passwords do not match', 'danger')
            return
        }
        try {
            await register({ email, password, display_name: displayName }).unwrap()
            showAlert('Account created successfully', 'success')
            navigate(ROUTES.HOME)
        } catch (err) {
            showAlert(err.data?.detail || 'Registration failed', 'danger')
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Create Account</h2>
                <p className="auth-subtitle">Sign up to unlock AI-powered tools</p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-field">
                        <label htmlFor="displayName">Name</label>
                        <input
                            id="displayName"
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Your name"
                            required
                        />
                    </div>
                    <div className="auth-field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div className="auth-field">
                        <label htmlFor="password">Password</label>
                        <div className="auth-password-wrapper">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min 8 characters"
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                className="auth-password-toggle"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/></svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="auth-field">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="auth-password-wrapper">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter your password"
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                className="auth-password-toggle"
                                onClick={() => setShowConfirmPassword((v) => !v)}
                                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            >
                                {showConfirmPassword ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/></svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="auth-btn auth-btn--primary" disabled={isLoading}>
                        {isLoading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>or</span>
                </div>

                <a href={GOOGLE_AUTH_URL} className="auth-btn auth-btn--google">
                    <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.0 24.0 0 0 0 0 21.56l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                    Continue with Google
                </a>

                <p className="auth-footer">
                    Already have an account? <Link to={ROUTES.LOGIN}>Sign in</Link>
                </p>
            </div>
        </div>
    )
}
