import { useState } from 'react'
import PropTypes from 'prop-types'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLogoutMutation } from '../store/api/authApi'
import { ROUTES } from '../constants'

export default function Navbar(props) {
    const [menuOpen, setMenuOpen] = useState(false)
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const [logout] = useLogoutMutation()

    const handleLogout = async () => {
        try {
            await logout().unwrap()
            props.showAlert('Logged out', 'success')
            navigate(ROUTES.HOME)
        } catch {
            props.showAlert('Logout failed', 'danger')
        }
    }

    return (
        <nav className="tu-navbar">
            <Link className="tu-brand" to="/">
                {props.title}
            </Link>

            {/* Desktop nav links */}
            <ul className="tu-nav-center d-none d-md-flex">
                <li>
                    <Link
                        className={`tu-nav-link${pathname === '/' ? ' tu-nav-link--active' : ''}`}
                        to="/"
                    >
                        {props.home}
                    </Link>
                </li>
                <li>
                    <Link
                        className={`tu-nav-link${pathname === '/about' ? ' tu-nav-link--active' : ''}`}
                        to="/about"
                    >
                        {props.about}
                    </Link>
                </li>
            </ul>

            <div className="tu-nav-right">
                {/* Auth section */}
                {props.isAuthenticated ? (
                    <div className="tu-nav-auth">
                        <span className="tu-nav-user">{props.user?.display_name}</span>
                        <button className="tu-nav-auth-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link className="tu-nav-auth-btn" to={ROUTES.LOGIN}>
                        Login
                    </Link>
                )}

                {/* Theme toggle */}
                <button
                    className="tu-theme-btn"
                    onClick={props.toggleMode}
                    aria-label="Toggle theme"
                    title={props.mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                >
                    {props.mode === 'light' ? '🌙' : '☀️'}
                </button>

                {/* Mobile hamburger */}
                <button
                    className="tu-theme-btn d-md-none"
                    onClick={() => setMenuOpen(o => !o)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile dropdown */}
            {menuOpen && (
                <div className="tu-mobile-menu">
                    <Link className="tu-mobile-link" to="/" onClick={() => setMenuOpen(false)}>
                        {props.home}
                    </Link>
                    <Link className="tu-mobile-link" to="/about" onClick={() => setMenuOpen(false)}>
                        {props.about}
                    </Link>
                    {props.isAuthenticated ? (
                        <button className="tu-mobile-link" onClick={() => { setMenuOpen(false); handleLogout() }}>
                            Logout
                        </button>
                    ) : (
                        <Link className="tu-mobile-link" to={ROUTES.LOGIN} onClick={() => setMenuOpen(false)}>
                            Login
                        </Link>
                    )}
                </div>
            )}
        </nav>
    )
}

Navbar.propTypes = {
    title: PropTypes.string.isRequired,
    home: PropTypes.string.isRequired,
    about: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
    toggleMode: PropTypes.func.isRequired,
    user: PropTypes.object,
    isAuthenticated: PropTypes.bool.isRequired,
    showAlert: PropTypes.func.isRequired,
}
