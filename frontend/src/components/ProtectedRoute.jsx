import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ROUTES } from '../constants'

export default function ProtectedRoute({ children }) {
    const { accessToken } = useSelector((state) => state.auth)
    if (!accessToken) return <Navigate to={ROUTES.LOGIN} replace />
    return children
}
