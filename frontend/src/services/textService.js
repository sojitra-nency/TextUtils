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
async function post(endpoint, body, timeoutMs = 30000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            signal: controller.signal,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || `Request failed: ${response.status}`);
        }

        return response.json();
    } catch (err) {
        if (err.name === 'AbortError') {
            throw new Error('Request timed out. Please try again.');
        }
        throw err;
    } finally {
        clearTimeout(timer);
    }
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

/** Convert text to snake_case */
export const toSnakeCase = (text) => post('/api/v1/text/snake-case', { text });

/** Convert text to kebab-case */
export const toKebabCase = (text) => post('/api/v1/text/kebab-case', { text });

/** Remove extra whitespace from text */
export const removeExtraSpaces = (text) => post('/api/v1/text/remove-extra-spaces', { text });

/** Strip all whitespace from text */
export const removeAllSpaces = (text) => post('/api/v1/text/remove-all-spaces', { text });

/** Remove line breaks, replacing them with spaces */
export const removeLineBreaks = (text) => post('/api/v1/text/remove-line-breaks', { text });

// ── Text Cleaning ────────────────────────────────────────────────────────────

export const stripHtml       = (text) => post('/api/v1/text/strip-html',        { text });
export const removeAccents   = (text) => post('/api/v1/text/remove-accents',    { text });
export const toggleSmartQuotes = (text) => post('/api/v1/text/toggle-smart-quotes', { text });

// ── Encoding ──────────────────────────────────────────────────────────────────

export const base64Encode = (text) => post('/api/v1/text/base64-encode', { text });
export const base64Decode = (text) => post('/api/v1/text/base64-decode', { text });
export const urlEncode    = (text) => post('/api/v1/text/url-encode',    { text });
export const urlDecode    = (text) => post('/api/v1/text/url-decode',    { text });
export const hexEncode    = (text) => post('/api/v1/text/hex-encode',    { text });
export const hexDecode    = (text) => post('/api/v1/text/hex-decode',    { text });
export const morseEncode  = (text) => post('/api/v1/text/morse-encode',  { text });
export const morseDecode  = (text) => post('/api/v1/text/morse-decode',  { text });

// ── Text Tools ────────────────────────────────────────────────────────────────

export const reverseText          = (text) => post('/api/v1/text/reverse',                 { text });
export const sortLinesAsc         = (text) => post('/api/v1/text/sort-lines-asc',          { text });
export const sortLinesDesc        = (text) => post('/api/v1/text/sort-lines-desc',         { text });
export const removeDuplicateLines = (text) => post('/api/v1/text/remove-duplicate-lines',  { text });
export const reverseLines        = (text) => post('/api/v1/text/reverse-lines',           { text });
export const numberLines         = (text) => post('/api/v1/text/number-lines',            { text });
export const rot13               = (text) => post('/api/v1/text/rot13',                   { text });

// ── Developer Tools ───────────────────────────────────────────────────────────

export const formatJson  = (text) => post('/api/v1/text/format-json',  { text });
export const jsonToYaml  = (text) => post('/api/v1/text/json-to-yaml', { text });

// ── Escape / Unescape ────────────────────────────────────────────────────────

export const jsonEscape   = (text) => post('/api/v1/text/json-escape',   { text });
export const jsonUnescape = (text) => post('/api/v1/text/json-unescape', { text });
export const htmlEscape   = (text) => post('/api/v1/text/html-escape',   { text });
export const htmlUnescape = (text) => post('/api/v1/text/html-unescape', { text });

// ── CSV / JSON Conversion ────────────────────────────────────────────────────

export const csvToJson = (text) => post('/api/v1/text/csv-to-json', { text });
export const jsonToCsv = (text) => post('/api/v1/text/json-to-csv', { text });

// ── AI Tools ─────────────────────────────────────────────────────────────────

export const generateHashtags        = (text) => post('/api/v1/text/generate-hashtags',          { text });
export const generateSeoTitles       = (text) => post('/api/v1/text/generate-seo-titles',       { text });
export const generateMetaDescriptions = (text) => post('/api/v1/text/generate-meta-descriptions', { text });
export const generateBlogOutline      = (text) => post('/api/v1/text/generate-blog-outline',      { text });
export const shortenForTweet          = (text) => post('/api/v1/text/shorten-for-tweet',          { text });
export const rewriteEmail            = (text) => post('/api/v1/text/rewrite-email',             { text });
export const extractKeywords        = (text) => post('/api/v1/text/extract-keywords',        { text });
export const translateText          = (text, target_language) => post('/api/v1/text/translate',       { text, target_language });
export const transliterateText     = (text, target_language) => post('/api/v1/text/transliterate',   { text, target_language });
export const summarizeText       = (text) => post('/api/v1/text/summarize',                    { text });
export const fixGrammar          = (text) => post('/api/v1/text/fix-grammar',                  { text });
export const paraphraseText      = (text) => post('/api/v1/text/paraphrase',                   { text });
export const changeTone          = (text, tone) => post('/api/v1/text/change-tone',            { text, tone });
export const analyzeSentiment    = (text) => post('/api/v1/text/analyze-sentiment',            { text });
export const lengthenText        = (text) => post('/api/v1/text/lengthen-text',                { text });
export const eli5Text            = (text) => post('/api/v1/text/eli5',                         { text });
export const proofreadText       = (text) => post('/api/v1/text/proofread',                    { text });
export const generateTitle       = (text) => post('/api/v1/text/generate-title',               { text });
export const refactorPrompt     = (text) => post('/api/v1/text/refactor-prompt',              { text });
export const changeFormat        = (text, format) => post('/api/v1/text/change-format',        { text, format });
