/**
 * App-wide constants.
 *
 * Centralise magic strings and configuration values here
 * so they can be updated in a single place.
 */

/** Application name displayed in the UI */
export const APP_NAME = 'TextUtils';

/** Default theme mode */
export const DEFAULT_MODE = 'light';

/** Alert auto-dismiss duration in milliseconds */
export const ALERT_TIMEOUT_MS = 1500;

/** Backend API base URL (overridden by .env) */
export const API_BASE_URL =
    process.env.REACT_APP_API_URL || 'http://localhost:8000';

/** Route paths */
export const ROUTES = {
    HOME: '/',
    ABOUT: '/about',
};

/** Reading speed assumption (words per minute) */
export const WORDS_PER_MINUTE = 125;
