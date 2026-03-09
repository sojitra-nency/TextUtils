import React, { useState, useEffect, useRef } from 'react'
import { jsPDF } from 'jspdf'
import { Document, Paragraph, TextRun, Packer } from 'docx'
import { marked } from 'marked'
import prettier from 'prettier/standalone'
import parserBabel from 'prettier/parser-babel'
import parserHtml from 'prettier/parser-html'
import parserCss from 'prettier/parser-postcss'
import parserTypescript from 'prettier/parser-typescript'
import * as textService from '../services/textService'

export default function TextForm(props) {
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(false)
    const [listening, setListening] = useState(false)
    const [dyslexiaMode, setDyslexiaMode] = useState(false)
    const [markdownMode, setMarkdownMode] = useState(false)
    const [showFmtCfg, setShowFmtCfg] = useState(false)
    const defaultFmtCfg = {
        tabWidth:         2,
        useTabs:          false,
        semi:             true,
        singleQuote:      false,
        trailingComma:    'es5',
        bracketSpacing:   true,
        arrowParens:      'always',
        jsxSingleQuote:   false,
        sortImports:      true,
    }
    const [fmtCfg, setFmtCfg] = useState(defaultFmtCfg)
    const [pendingFmtCfg, setPendingFmtCfg] = useState(defaultFmtCfg)
    const recognitionRef = useRef(null)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const shared = params.get('t')
        if (shared) {
            try { setText(decodeURIComponent(atob(shared))) } catch {}
        }
    }, [])

    // Async handler for backend API calls
    const callApi = async (serviceFn, successMsg) => {
        if (!text) return
        setLoading(true)
        try {
            const data = await serviceFn(text)
            setText(data.result)
            props.showAlert(successMsg, 'success')
        } catch (err) {
            props.showAlert(err.message || 'API error', 'danger')
        } finally {
            setLoading(false)
        }
    }


    // ── Clipboard ──────────────────────────────────────────────────────────────
    const handleClear = () => {
        setText('')
        props.showAlert('Text cleared', 'success')
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(text)
        props.showAlert('Copied to clipboard', 'success')
    }

    const handlePaste = () => {
        navigator.clipboard.readText().then(t => setText(prev => prev + t))
        props.showAlert('Pasted from clipboard', 'success')
    }

    const handleClearPaste = () => {
        navigator.clipboard.readText().then(t => setText(t))
        props.showAlert('Cleared and pasted', 'success')
    }

    // ── Speech ─────────────────────────────────────────────────────────────────
    const handleTts = () => {
        const msg = new SpeechSynthesisUtterance(text)
        window.speechSynthesis.speak(msg)
        props.showAlert('Speaking\u2026', 'info')
    }

    const handleSpeechToText = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognition) {
            props.showAlert('Speech recognition not supported in this browser', 'danger')
            return
        }
        if (listening) {
            recognitionRef.current?.stop()
            setListening(false)
            return
        }
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = false
        recognition.lang = 'en-US'
        recognition.onresult = (e) => {
            const transcript = Array.from(e.results).map(r => r[0].transcript).join(' ')
            setText(prev => prev ? prev + ' ' + transcript : transcript)
        }
        recognition.onerror = () => {
            setListening(false)
            props.showAlert('Speech recognition error', 'danger')
        }
        recognition.onend = () => setListening(false)
        recognitionRef.current = recognition
        recognition.start()
        setListening(true)
        props.showAlert('Listening\u2026 speak now', 'info')
    }

    // ── Encoding ───────────────────────────────────────────────────────────────
    const handleBase64Encode = () => callApi(textService.base64Encode, 'Base64 encoded')
    const handleBase64Decode = () => callApi(textService.base64Decode, 'Base64 decoded')
    const handleUrlEncode    = () => callApi(textService.urlEncode,    'URL encoded')
    const handleUrlDecode    = () => callApi(textService.urlDecode,    'URL decoded')

    // ── Developer Tools ────────────────────────────────────────────────────────
    const handleJsonFormat  = () => callApi(textService.formatJson, 'JSON formatted')
    const handleJsonToYaml  = () => callApi(textService.jsonToYaml, 'Converted to YAML')
    const handleMinify      = () => callApi(textService.minify,     'Text minified')

    // Sort import lines: node_modules first, then relative, each group alphabetical
    const sortImportsAlphabetically = (code) => {
        const lines = code.split('\n')
        let i = 0
        while (i < lines.length && lines[i].trim() === '') i++
        const start = i
        const importLines = []
        while (i < lines.length && /^\s*import\s/.test(lines[i])) {
            importLines.push(lines[i])
            i++
        }
        if (importLines.length < 2) return code
        const sorted = [...importLines].sort((a, b) => {
            const aFrom = a.match(/from\s+['"](.+)['"]/)?.[1] ?? a
            const bFrom = b.match(/from\s+['"](.+)['"]/)?.[1] ?? b
            const aRel = aFrom.startsWith('.')
            const bRel = bFrom.startsWith('.')
            if (aRel !== bRel) return aRel ? 1 : -1
            return aFrom.localeCompare(bFrom)
        })
        return [...lines.slice(0, start), ...sorted, ...lines.slice(i)].join('\n')
    }

    // Core Prettier runner (frontend-only, no backend call)
    const runFormat = async (parser, plugins, successMsg) => {
        if (!text) return
        setLoading(true)
        try {
            let code = text
            if (fmtCfg.sortImports && ['babel', 'babel-ts', 'typescript'].includes(parser)) {
                code = sortImportsAlphabetically(code)
            }
            const formatted = prettier.format(code, {
                parser,
                plugins,
                tabWidth:       fmtCfg.tabWidth,
                useTabs:        fmtCfg.useTabs,
                semi:           fmtCfg.semi,
                singleQuote:    fmtCfg.singleQuote,
                trailingComma:  fmtCfg.trailingComma,
                bracketSpacing: fmtCfg.bracketSpacing,
                arrowParens:    fmtCfg.arrowParens,
                jsxSingleQuote: fmtCfg.jsxSingleQuote,
            })
            setText(formatted)
            props.showAlert(successMsg, 'success')
        } catch (err) {
            props.showAlert(err.message?.split('\n')[0] || 'Format error', 'danger')
        } finally {
            setLoading(false)
        }
    }

    const handleFormatHtml = () => runFormat('html',       [parserHtml],       'HTML formatted')
    const handleFormatCss  = () => runFormat('css',        [parserCss],        'CSS formatted')
    const handleFormatJs   = () => runFormat('babel',      [parserBabel],      'JS / JSX formatted')
    const handleFormatTs   = () => runFormat('typescript', [parserTypescript], 'TypeScript formatted')

    // Formatter pending config helpers (staged, only committed on Apply)
    const setPendingFmt = (patch) => setPendingFmtCfg(c => ({ ...c, ...patch }))

    // ── Accessibility ──────────────────────────────────────────────────────────
    const handleDyslexiaMode = () => {
        setDyslexiaMode(prev => {
            props.showAlert(!prev ? 'Dyslexia font on' : 'Dyslexia font off', 'info')
            return !prev
        })
    }

    const handleMarkdownMode = () => {
        setMarkdownMode(prev => {
            props.showAlert(!prev ? 'Markdown preview on' : 'Markdown preview off', 'info')
            return !prev
        })
    }

    // ── Export & Share ─────────────────────────────────────────────────────────
    const triggerDownload = (blob, filename) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleDownloadTxt = () => {
        triggerDownload(new Blob([text], { type: 'text/plain' }), 'textutils.txt')
        props.showAlert('Downloaded as TXT', 'success')
    }

    const handleDownloadJson = () => {
        triggerDownload(
            new Blob([JSON.stringify({ text }, null, 2)], { type: 'application/json' }),
            'textutils.json'
        )
        props.showAlert('Downloaded as JSON', 'success')
    }

    const handleDownloadPdf = () => {
        const doc = new jsPDF()
        const lines = doc.splitTextToSize(text, 180)
        doc.text(lines, 14, 20)
        doc.save('textutils.pdf')
        props.showAlert('Downloaded as PDF', 'success')
    }

    const handleDownloadDocx = async () => {
        const paragraphs = text.split('\n').map(line =>
            new Paragraph({ children: [new TextRun(line)] })
        )
        const wordDoc = new Document({ sections: [{ properties: {}, children: paragraphs }] })
        const blob = await Packer.toBlob(wordDoc)
        triggerDownload(blob, 'textutils.docx')
        props.showAlert('Downloaded as DOCX', 'success')
    }

    const handleShare = () => {
        const encoded = btoa(encodeURIComponent(text))
        const url = `${window.location.origin}${window.location.pathname}?t=${encoded}`
        navigator.clipboard.writeText(url)
        props.showAlert('Share link copied to clipboard!', 'success')
    }

    // ── Derived stats ──────────────────────────────────────────────────────────
    const handleChange = (e) => setText(e.target.value)

    const disabled = text.length === 0 || loading

    const words        = text.split(/\s+/).filter(Boolean).length
    const chars        = text.length
    const charsNoSpaces = text.replace(/\s/g, '').length
    const sentences    = text.split(/[.?]\s*(?=\S|$)|\n/).filter(s => s.trim()).length
    const readingTime  = (words / 125).toFixed(2)
    const specialChars = text.replace(/[a-zA-Z0-9\s]/g, '').length

    const stats = [
        { label: 'Words',          value: words         },
        { label: 'Characters',     value: chars         },
        { label: 'No-space chars', value: charsNoSpaces },
        { label: 'Sentences',      value: sentences     },
        { label: 'Special chars',  value: specialChars  },
        { label: 'Min. to read',   value: readingTime   },
    ]

    return (
        <div className="tu-workspace">
            {/* Ambient blobs */}
            <div className="tu-blob tu-blob-1" />
            <div className="tu-blob tu-blob-2" />
            <div className="tu-blob tu-blob-3" />

            {/* Hero */}
            <div className="tu-hero">
                <h1 className="tu-hero-title">
                    Transform Your <span className="tu-gradient-text">Text</span>
                </h1>
                <p className="tu-hero-sub">
                    Powerful utilities &mdash; instant results.
                </p>
            </div>

            {/* Editor card */}
            <div className="tu-editor-card">
                <div className="tu-editor-topbar">
                    <div className="tu-dots">
                        <span /><span /><span />
                    </div>
                    <span className="tu-editor-label">Text Editor</span>
                </div>

                <textarea
                    className={`tu-textarea${dyslexiaMode ? ' tu-dyslexia' : ''}`}
                    id="text"
                    rows="10"
                    value={text}
                    onChange={handleChange}
                    placeholder="Start typing or paste your text here\u2026"
                />

                <div className="tu-actions">

                    {/* Case Transformations */}
                    <div className="tu-action-group">
                        <p className="tu-group-label">Case Transformations</p>
                        <div className="tu-btn-row">
                            <button disabled={disabled} className="tu-btn tu-btn--case"
                                onClick={() => callApi(textService.toUpperCase, 'Converted to uppercase')}>
                                Uppercase
                            </button>
                            <button disabled={disabled} className="tu-btn tu-btn--case"
                                onClick={() => callApi(textService.toLowerCase, 'Converted to lowercase')}>
                                Lowercase
                            </button>
                            <button disabled={disabled} className="tu-btn tu-btn--case"
                                onClick={() => callApi(textService.toTitleCase, 'Converted to title case')}>
                                Title Case
                            </button>
                            <button disabled={disabled} className="tu-btn tu-btn--case"
                                onClick={() => callApi(textService.toSentenceCase, 'Converted to sentence case')}>
                                Sentence Case
                            </button>
                            <button disabled={disabled} className="tu-btn tu-btn--case"
                                onClick={() => callApi(textService.toInverseCase, 'Case toggled')}>
                                Toggle Case
                            </button>
                            <button disabled={disabled} className="tu-btn tu-btn--case"
                                onClick={() => callApi(textService.toUpperCamelCase, 'Converted to UpperCamelCase')}>
                                UpperCamelCase
                            </button>
                            <button disabled={disabled} className="tu-btn tu-btn--case"
                                onClick={() => callApi(textService.toLowerCamelCase, 'Converted to lowerCamelCase')}>
                                lowerCamelCase
                            </button>
                        </div>
                    </div>

                    {/* Whitespace */}
                    <div className="tu-action-group">
                        <p className="tu-group-label">Whitespace</p>
                        <div className="tu-btn-row">
                            <button disabled={disabled} className="tu-btn tu-btn--space"
                                onClick={() => callApi(textService.removeExtraSpaces, 'Removed extra spaces')}>
                                Remove Extra Spaces
                            </button>
                            <button disabled={disabled} className="tu-btn tu-btn--space"
                                onClick={() => callApi(textService.removeLineBreaks, 'Removed line breaks')}>
                                Remove Line Breaks
                            </button>
                            <button disabled={disabled} className="tu-btn tu-btn--space"
                                onClick={() => callApi(textService.removeAllSpaces, 'Removed all spaces')}>
                                Remove All Spaces
                            </button>
                            <button disabled={disabled} className="tu-btn tu-btn--space"
                                onClick={handleMinify}>
                                Minify
                            </button>
                        </div>
                    </div>

                    {/* Encoding */}
                    <div className="tu-action-group">
                        <p className="tu-group-label">Encoding</p>
                        <div className="tu-btn-row">
                            <button disabled={disabled} className="tu-btn tu-btn--encode"
                                onClick={handleBase64Encode}>
                                Base64 Encode
                            </button>
                            <button disabled={disabled} className="tu-btn tu-btn--encode"
                                onClick={handleBase64Decode}>
                                Base64 Decode
                            </button>
                            <button disabled={disabled} className="tu-btn tu-btn--encode"
                                onClick={handleUrlEncode}>
                                URL Encode
                            </button>
                            <button disabled={disabled} className="tu-btn tu-btn--encode"
                                onClick={handleUrlDecode}>
                                URL Decode
                            </button>
                        </div>
                    </div>

                    {/* Developer Tools */}
                    <div className="tu-action-group">
                        <p className="tu-group-label">Developer Tools</p>

                        {/* Data sub-group */}
                        <p className="tu-group-sublabel">Data</p>
                        <div className="tu-btn-row">
                            <button disabled={disabled} className="tu-btn tu-btn--dev"
                                onClick={handleJsonFormat}>
                                Format JSON
                            </button>
                            <button disabled={disabled} className="tu-btn tu-btn--dev"
                                onClick={handleJsonToYaml}>
                                JSON &rarr; YAML
                            </button>
                        </div>

                        {/* Code Formatters sub-group */}
                        <p className="tu-group-sublabel">Code Formatters</p>
                        <p className="tu-fmt-hint">
                            Paste your code above &rarr; optionally configure settings &rarr; click a format button
                        </p>
                        <div className="tu-btn-row">
                            <button disabled={disabled} className="tu-btn tu-btn--dev"
                                onClick={handleFormatHtml}>
                                Format HTML
                            </button>
                            <button disabled={disabled} className="tu-btn tu-btn--dev"
                                onClick={handleFormatCss}>
                                Format CSS
                            </button>
                            <button disabled={disabled} className="tu-btn tu-btn--dev"
                                onClick={handleFormatJs}>
                                Format JS / JSX
                            </button>
                            <button disabled={disabled} className="tu-btn tu-btn--dev"
                                onClick={handleFormatTs}>
                                Format TS
                            </button>
                            <button
                                className={`tu-btn ${showFmtCfg ? 'tu-btn--dev-active' : 'tu-btn--dev'}`}
                                onClick={() => {
                                    if (!showFmtCfg) setPendingFmtCfg(fmtCfg)
                                    setShowFmtCfg(p => !p)
                                }}>
                                ⚙ {showFmtCfg ? 'Hide Settings' : 'Formatter Settings'}
                            </button>
                        </div>

                        {/* Formatter Settings Panel */}
                        {showFmtCfg && (
                            <div className="tu-fmt-cfg">
                                <div className="tu-fmt-cfg-header">
                                    <span className="tu-fmt-cfg-title">⚙ Formatter Settings</span>
                                    <span className="tu-fmt-cfg-desc">Customize code style. Click Apply to save — settings take effect on next format.</span>
                                </div>

                                <div className="tu-fmt-section-label">Options</div>
                                <div className="tu-fmt-grid">
                                    <label className="tu-fmt-field">
                                        <span>Tab Width</span>
                                        <select value={pendingFmtCfg.tabWidth}
                                            onChange={e => setPendingFmt({ tabWidth: +e.target.value })}>
                                            <option value={2}>2 spaces</option>
                                            <option value={4}>4 spaces</option>
                                            <option value={8}>8 spaces</option>
                                        </select>
                                    </label>
                                    <label className="tu-fmt-field">
                                        <span>Quotes</span>
                                        <select value={pendingFmtCfg.singleQuote ? 'single' : 'double'}
                                            onChange={e => setPendingFmt({ singleQuote: e.target.value === 'single' })}>
                                            <option value="double">Double (")</option>
                                            <option value="single">Single (')</option>
                                        </select>
                                    </label>
                                    <label className="tu-fmt-field">
                                        <span>Trailing Comma</span>
                                        <select value={pendingFmtCfg.trailingComma}
                                            onChange={e => setPendingFmt({ trailingComma: e.target.value })}>
                                            <option value="none">None</option>
                                            <option value="es5">ES5</option>
                                            <option value="all">All</option>
                                        </select>
                                    </label>
                                    <label className="tu-fmt-field">
                                        <span>Arrow Parens</span>
                                        <select value={pendingFmtCfg.arrowParens}
                                            onChange={e => setPendingFmt({ arrowParens: e.target.value })}>
                                            <option value="always">Always</option>
                                            <option value="avoid">Avoid</option>
                                        </select>
                                    </label>
                                </div>

                                <div className="tu-fmt-section-label">Flags</div>
                                <div className="tu-fmt-checks">
                                    {[
                                        ['useTabs',        'Use Tabs (instead of spaces)'],
                                        ['semi',           'Semicolons at end of statements'],
                                        ['bracketSpacing', 'Bracket Spacing  { a: 1 }'],
                                        ['jsxSingleQuote', 'JSX Single Quotes'],
                                        ['sortImports',    'Sort Imports A–Z'],
                                    ].map(([key, label]) => (
                                        <label className="tu-fmt-check" key={key}>
                                            <input type="checkbox" checked={pendingFmtCfg[key]}
                                                onChange={e => setPendingFmt({ [key]: e.target.checked })} />
                                            <span>{label}</span>
                                        </label>
                                    ))}
                                </div>

                                <div className="tu-fmt-presets">
                                    <span className="tu-fmt-preset-label">Quick Presets:</span>
                                    <button className="tu-btn tu-btn--dev" onClick={() => setPendingFmt({ trailingComma: 'none',  arrowParens: 'avoid',  semi: true,  singleQuote: false })}>ES5</button>
                                    <button className="tu-btn tu-btn--dev" onClick={() => setPendingFmt({ trailingComma: 'es5',   arrowParens: 'always', semi: true,  singleQuote: true  })}>ES6</button>
                                    <button className="tu-btn tu-btn--dev" onClick={() => setPendingFmt({ trailingComma: 'all',   arrowParens: 'always', semi: false, singleQuote: true, jsxSingleQuote: false })}>React</button>
                                </div>

                                <div className="tu-fmt-actions">
                                    <button className="tu-btn tu-btn--dev"
                                        onClick={() => { setPendingFmtCfg(fmtCfg); setShowFmtCfg(false) }}>
                                        Cancel
                                    </button>
                                    <button className="tu-btn tu-btn--apply"
                                        onClick={() => {
                                            setFmtCfg(pendingFmtCfg)
                                            setShowFmtCfg(false)
                                            props.showAlert('Formatter settings applied', 'success')
                                        }}>
                                        ✓ Apply Settings
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Clipboard */}
                    <div className="tu-action-group">
                        <p className="tu-group-label">Clipboard</p>
                        <div className="tu-btn-row">
                            <button disabled={disabled} className="tu-btn tu-btn--clip"
                                onClick={handleCopy}>
                                Copy
                            </button>
                            <button disabled={loading} className="tu-btn tu-btn--clip"
                                onClick={handlePaste}>
                                Paste
                            </button>
                            <button disabled={loading} className="tu-btn tu-btn--clip"
                                onClick={handleClearPaste}>
                                Clear &amp; Paste
                            </button>
                            <button disabled={text.length === 0} className="tu-btn tu-btn--danger"
                                onClick={handleClear}>
                                Clear
                            </button>
                        </div>
                    </div>

                    {/* Speech */}
                    <div className="tu-action-group">
                        <p className="tu-group-label">Speech</p>
                        <div className="tu-btn-row">
                            <button disabled={disabled} className="tu-btn tu-btn--amber"
                                onClick={handleTts}>
                                Text to Speech
                            </button>
                            <button
                                className={`tu-btn ${listening ? 'tu-btn--listening' : 'tu-btn--stt'}`}
                                onClick={handleSpeechToText}>
                                {listening ? 'Stop Listening' : 'Speech to Text'}
                            </button>
                        </div>
                    </div>

                    {/* Accessibility */}
                    <div className="tu-action-group">
                        <p className="tu-group-label">Accessibility</p>
                        <div className="tu-btn-row">
                            <button
                                className={`tu-btn ${dyslexiaMode ? 'tu-btn--dyslexia-on' : 'tu-btn--dyslexia'}`}
                                onClick={handleDyslexiaMode}>
                                {dyslexiaMode ? 'Dyslexia Font: ON' : 'Dyslexia Font'}
                            </button>
                        </div>
                    </div>

                    {/* Export & Share */}
                    <div className="tu-action-group">
                        <p className="tu-group-label">Export &amp; Share</p>
                        <div className="tu-btn-row">
                            <button disabled={disabled} className="tu-btn tu-btn--export"
                                onClick={handleDownloadTxt}>
                                Download TXT
                            </button>
                            <button disabled={disabled} className="tu-btn tu-btn--export"
                                onClick={handleDownloadPdf}>
                                Download PDF
                            </button>
                            <button disabled={disabled} className="tu-btn tu-btn--export"
                                onClick={handleDownloadDocx}>
                                Download DOCX
                            </button>
                            <button disabled={disabled} className="tu-btn tu-btn--export"
                                onClick={handleDownloadJson}>
                                Download JSON
                            </button>
                            <button disabled={disabled} className="tu-btn tu-btn--share"
                                onClick={handleShare}>
                                Share Link
                            </button>
                        </div>
                    </div>

                </div>

                {loading && (
                    <div className="tu-loading">
                        <div className="tu-spinner" />
                        Processing&hellip;
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="tu-stats">
                {stats.map(({ label, value }) => (
                    <div className="tu-stat-card" key={label}>
                        <span className="tu-stat-value">{value}</span>
                        <span className="tu-stat-label">{label}</span>
                    </div>
                ))}
            </div>

            {/* Preview */}
            <div className="tu-preview-card">
                <div className="tu-preview-header">
                    <span className="tu-preview-title">Preview</span>
                    <button
                        className={`tu-btn tu-btn--preview-toggle ${markdownMode ? 'tu-btn--preview-on' : ''}`}
                        onClick={handleMarkdownMode}>
                        {markdownMode ? 'Markdown: ON' : 'Markdown'}
                    </button>
                </div>
                {markdownMode ? (
                    <div
                        className={`tu-preview-body tu-preview-markdown${dyslexiaMode ? ' tu-dyslexia' : ''}`}
                        dangerouslySetInnerHTML={{ __html: text ? marked.parse(text) : '<span class="tu-preview-empty">Nothing to preview yet…</span>' }}
                    />
                ) : (
                    <div className={`tu-preview-body${dyslexiaMode ? ' tu-dyslexia' : ''}`}>
                        {text.length > 0
                            ? text
                            : <span className="tu-preview-empty">Nothing to preview yet&hellip;</span>
                        }
                    </div>
                )}
            </div>
        </div>
    )
}
