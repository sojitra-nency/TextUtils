/**
 * textService — wrapper functions for calling the TextUtils FastAPI backend.
 *
 * Base URL is picked from the environment variable REACT_APP_API_URL,
 * falling back to localhost:8000 for local development.
 */

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Generic helper that performs a POST request to the backend.
 * @param {string} endpoint  - API path (e.g. '/api/v1/text/uppercase')
 * @param {object} body      - JSON payload
 * @returns {Promise<object>} Parsed JSON response
 */
async function post(endpoint, body) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `Request failed: ${response.status}`);
    }

    return response.json();
}

// ── Text transformation endpoints ─────────────────────────────────────────────

/** Convert text to UPPERCASE */
export const toUpperCase = (text) => post('/api/v1/text/uppercase', { text });

/** Convert text to lowercase */
export const toLowerCase = (text) => post('/api/v1/text/lowercase', { text });

/** Invert case of every character */
export const toInverseCase = (text) => post('/api/v1/text/inversecase', { text });

/** Convert text to Sentence case */
export const toSentenceCase = (text) => post('/api/v1/text/sentencecase', { text });

/** Convert text to Title Case */
export const toTitleCase = (text) => post('/api/v1/text/titlecase', { text });

/** Convert text to UpperCamelCase (PascalCase) */
export const toUpperCamelCase = (text) => post('/api/v1/text/upper-camel-case', { text });

/** Convert text to lowerCamelCase */
export const toLowerCamelCase = (text) => post('/api/v1/text/lower-camel-case', { text });

/** Remove extra whitespace from text */
export const removeExtraSpaces = (text) => post('/api/v1/text/remove-extra-spaces', { text });

/** Strip all whitespace from text */
export const removeAllSpaces = (text) => post('/api/v1/text/remove-all-spaces', { text });

/** Remove line breaks, replacing them with spaces */
export const removeLineBreaks = (text) => post('/api/v1/text/remove-line-breaks', { text });
