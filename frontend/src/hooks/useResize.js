import { useState, useCallback, useEffect, useRef } from 'react'

/**
 * useResize — drag-to-resize hook
 * @param {'horizontal'|'vertical'} direction
 * @param {number} initial — initial size (px or %)
 * @param {object} opts — { min, max, storageKey, unit: 'px'|'percent', containerRef }
 */
export default function useResize(direction, initial, opts = {}) {
    const { min = 100, max = 800, storageKey, unit = 'px', containerRef } = opts

    const [size, setSize] = useState(() => {
        if (storageKey) {
            const saved = localStorage.getItem(storageKey)
            if (saved) return Math.max(min, Math.min(max, Number(saved)))
        }
        return initial
    })

    const dragging = useRef(false)
    const startPos = useRef(0)
    const startSize = useRef(0)
    const sizeRef = useRef(size)
    sizeRef.current = size

    const onMouseDown = useCallback((e) => {
        e.preventDefault()
        dragging.current = true
        startPos.current = direction === 'horizontal' ? e.clientX : e.clientY
        startSize.current = sizeRef.current
        document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize'
        document.body.style.userSelect = 'none'
    }, [direction])

    useEffect(() => {
        const onMouseMove = (e) => {
            if (!dragging.current) return

            if (unit === 'percent' && containerRef?.current) {
                const rect = containerRef.current.getBoundingClientRect()
                const pos = direction === 'horizontal' ? e.clientX - rect.left : e.clientY - rect.top
                const total = direction === 'horizontal' ? rect.width : rect.height
                const pct = Math.max(min, Math.min(max, (pos / total) * 100))
                setSize(Math.round(pct))
            } else {
                const delta = direction === 'horizontal'
                    ? e.clientX - startPos.current
                    : startPos.current - e.clientY
                const newSize = Math.max(min, Math.min(max, startSize.current + delta))
                setSize(newSize)
            }
        }

        const onMouseUp = () => {
            if (!dragging.current) return
            dragging.current = false
            document.body.style.cursor = ''
            document.body.style.userSelect = ''
            if (storageKey) localStorage.setItem(storageKey, String(sizeRef.current))
        }

        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onMouseUp)
        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup', onMouseUp)
        }
    }, [direction, min, max, storageKey, unit, containerRef])

    return { size, onMouseDown, setSize }
}
