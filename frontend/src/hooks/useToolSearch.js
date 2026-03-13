import { useState, useMemo, useCallback } from 'react'
import { TOOLS, SEARCH_INTENTS } from '../constants/tools'

export default function useToolSearch() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const results = useMemo(() => {
    if (!query.trim()) return []

    const q = query.toLowerCase().trim()
    const scores = new Map()

    // 1. Check intent mapping first
    for (const intent of SEARCH_INTENTS) {
      for (const phrase of intent.phrases) {
        if (q.includes(phrase) || phrase.includes(q)) {
          intent.toolIds.forEach(id => {
            scores.set(id, (scores.get(id) || 0) + 10)
          })
        }
      }
    }

    // 2. Fuzzy match on tool label, description, keywords
    for (const tool of TOOLS) {
      let score = scores.get(tool.id) || 0

      const label = tool.label.toLowerCase()
      const desc = tool.description.toLowerCase()
      const kw = tool.keywords || []

      if (label === q) score += 20
      else if (label.startsWith(q)) score += 15
      else if (label.includes(q)) score += 8

      if (desc.includes(q)) score += 5

      for (const k of kw) {
        if (k === q) score += 12
        else if (k.startsWith(q) || q.startsWith(k)) score += 7
        else if (k.includes(q) || q.includes(k)) score += 4
      }

      if (score > 0) scores.set(tool.id, score)
    }

    return [...scores.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([id]) => TOOLS.find(t => t.id === id))
      .filter(Boolean)
  }, [query])

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => { setIsOpen(false); setQuery('') }, [])

  return { query, setQuery, results, isOpen, open, close }
}
