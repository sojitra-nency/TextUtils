import { useState, useCallback } from 'react'

const MAX_HISTORY = 50

export default function useHistory(setText, showAlert) {
    const [history, setHistory] = useState([])

    const pushHistory = useCallback((operation, original, result) => {
        setHistory(prev => {
            const entry = { operation, original, result, timestamp: Date.now() }
            const next = [...prev, entry]
            return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next
        })
    }, [])

    const handleRestoreOriginal = (idx) => {
        setText(history[idx].original)
        showAlert(`Restored original from "${history[idx].operation}"`, 'success')
    }

    const handleRestoreResult = (idx) => {
        setText(history[idx].result)
        showAlert(`Restored result of "${history[idx].operation}"`, 'success')
    }

    const handleClearHistory = () => {
        setHistory([])
        showAlert('History cleared', 'success')
    }

    return {
        history, pushHistory,
        handleRestoreOriginal, handleRestoreResult, handleClearHistory,
    }
}
