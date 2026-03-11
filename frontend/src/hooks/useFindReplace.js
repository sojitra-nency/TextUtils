import { useState } from 'react'

export default function useFindReplace(text, setText, showAlert) {
    const [findText, setFindText] = useState('')
    const [replaceText, setReplaceText] = useState('')
    const [findCaseSensitive, setFindCaseSensitive] = useState(false)
    const [findUseRegex, setFindUseRegex] = useState(false)
    const [replaceCount, setReplaceCount] = useState(null)

    const handleReplaceAll = () => {
        if (!findText) { showAlert('Enter a search term', 'danger'); return }
        try {
            let count = 0
            const flags = findCaseSensitive ? 'g' : 'gi'
            const pattern = findUseRegex
                ? findText
                : findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            const re = new RegExp(pattern, flags)
            const result = text.replace(re, () => { count++; return replaceText })
            setText(result)
            setReplaceCount(count)
            showAlert(`Replaced ${count} occurrence${count !== 1 ? 's' : ''}`, count ? 'success' : 'info')
        } catch (err) {
            showAlert('Invalid regex: ' + err.message, 'danger')
        }
    }

    return {
        findText, setFindText,
        replaceText, setReplaceText,
        findCaseSensitive, setFindCaseSensitive,
        findUseRegex, setFindUseRegex,
        replaceCount, setReplaceCount,
        handleReplaceAll,
    }
}
