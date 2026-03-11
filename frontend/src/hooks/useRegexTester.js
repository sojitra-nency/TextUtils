import { useState } from 'react'

export default function useRegexTester(text, showAlert) {
    const [regexPattern, setRegexPattern] = useState('')
    const [regexFlags, setRegexFlags] = useState('g')
    const [regexResult, setRegexResult] = useState(null)

    const handleRegexTest = () => {
        if (!regexPattern) { showAlert('Enter a regex pattern', 'danger'); return }
        if (!text) { showAlert('Enter some text to test against', 'danger'); return }
        try {
            const re = new RegExp(regexPattern, regexFlags)
            const matches = []
            let m
            if (regexFlags.includes('g')) {
                while ((m = re.exec(text)) !== null) {
                    matches.push({ match: m[0], index: m.index, groups: m.slice(1) })
                    if (!m[0]) re.lastIndex++
                }
            } else {
                m = re.exec(text)
                if (m) matches.push({ match: m[0], index: m.index, groups: m.slice(1) })
            }
            setRegexResult({ matches, total: matches.length })
            showAlert(`${matches.length} match${matches.length !== 1 ? 'es' : ''} found`, matches.length ? 'success' : 'info')
        } catch (err) {
            showAlert('Invalid regex: ' + err.message, 'danger')
        }
    }

    return {
        regexPattern, setRegexPattern,
        regexFlags, setRegexFlags,
        regexResult, setRegexResult,
        handleRegexTest,
    }
}
