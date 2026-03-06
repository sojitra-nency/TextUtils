/**
 * useAlert — manages a temporary alert notification.
 *
 * Usage:
 *   const { alert, showAlert } = useAlert();
 */
import { useState } from 'react';

export function useAlert(timeout = 1500) {
    const [alert, setAlert] = useState(null);

    const showAlert = (message, type = 'info') => {
        setAlert({ msg: message, type });
        setTimeout(() => setAlert(null), timeout);
    };

    return { alert, showAlert };
}
