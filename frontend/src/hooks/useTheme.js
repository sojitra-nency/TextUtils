/**
 * useTheme — manages light/dark mode toggle.
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
            document.body.style.backgroundColor = '#163563';
            document.body.style.color = 'white';
            showAlert('Dark Mode has been enabled', 'success');
        } else {
            setMode('light');
            document.body.style.backgroundColor = 'white';
            document.body.style.color = '#163563';
            showAlert('Light Mode has been enabled', 'success');
        }
    };

    return { mode, toggleMode };
}
