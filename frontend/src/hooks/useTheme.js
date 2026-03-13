/**
 * useTheme — manages light/dark mode.
 * CSS class on <body>: body.dark → dark mode colors
 */
import { useState, useCallback, useEffect } from 'react';

const MODE_KEY = 'fmx_theme_mode';

function applyMode(mode) {
    if (mode === 'dark') document.body.classList.add('dark');
    else document.body.classList.remove('dark');
}

export function useTheme(showAlert) {
    const [mode, setModeState] = useState(() => {
        const saved = localStorage.getItem(MODE_KEY) || 'dark';
        applyMode(saved);
        return saved;
    });

    const toggleMode = useCallback(() => {
        setModeState(prev => {
            const next = prev === 'dark' ? 'light' : 'dark';
            applyMode(next);
            localStorage.setItem(MODE_KEY, next);
            showAlert(`${next === 'dark' ? 'Dark' : 'Light'} mode enabled`, 'success');
            return next;
        });
    }, [showAlert]);

    const setMode = useCallback((newMode) => {
        setModeState(newMode);
        applyMode(newMode);
        localStorage.setItem(MODE_KEY, newMode);
    }, []);

    useEffect(() => { applyMode(mode); }, [mode]);

    return { mode, toggleMode, setMode };
}
