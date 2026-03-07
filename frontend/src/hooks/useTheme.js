/**
 * useTheme — manages light/dark mode toggle via a CSS class on <body>.
 *
 * Usage:
 *   const { mode, toggleMode } = useTheme(showAlert);
 */
import { useState } from 'react';

export function useTheme(showAlert) {
    const [mode, setMode] = useState('light');

    const toggleMode = () => {
        if (mode === 'light') {
            setMode('dark');
            document.body.classList.add('dark');
            showAlert('Dark mode enabled', 'success');
        } else {
            setMode('light');
            document.body.classList.remove('dark');
            showAlert('Light mode enabled', 'success');
        }
    };

    return { mode, toggleMode };
}
