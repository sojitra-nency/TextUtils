import { useState, useEffect, useRef } from 'react'
import { SMART_SUGGESTION_RULES, TOOLS } from '../constants/tools'

export default function useSmartSuggestions(text) {
  const [suggestions, setSuggestions] = useState([])
  const [dismissed, setDismissed] = useState(new Set())
  const timerRef = useRef(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    if (!text || text.length < 5) {
      setSuggestions([])
      return
    }

    // Debounce detection by 500ms
    timerRef.current = setTimeout(() => {
      const matched = new Set()
      for (const rule of SMART_SUGGESTION_RULES) {
        try {
          if (rule.test(text)) {
            rule.toolIds.forEach(id => matched.add(id))
          }
        } catch { /* ignore rule errors */ }
      }

      const results = [...matched]
        .filter(id => !dismissed.has(id))
        .slice(0, 4)
        .map(id => TOOLS.find(t => t.id === id))
        .filter(Boolean)

      setSuggestions(results)
    }, 500)

    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [text, dismissed])

  const dismiss = (toolId) => {
    setDismissed(prev => new Set(prev).add(toolId))
  }

  const clearDismissed = () => setDismissed(new Set())

  return { suggestions, dismiss, clearDismissed }
}
