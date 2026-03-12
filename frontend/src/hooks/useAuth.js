import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useRefreshMutation, useGetMeQuery } from '../store/api/authApi'

export function useAuth() {
    const { accessToken, user } = useSelector((s) => s.auth)
    const [refresh] = useRefreshMutation()
    const attempted = useRef(false)

    useEffect(() => {
        if (!accessToken && !attempted.current) {
            attempted.current = true
            refresh().unwrap().catch(() => {})
        }
    }, [])

    useGetMeQuery(undefined, { skip: !accessToken })

    return { user, isAuthenticated: !!accessToken }
}
