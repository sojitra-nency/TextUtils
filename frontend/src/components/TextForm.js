import React, { useState } from 'react'
import * as textService from '../services/textService'

export default function TextForm(props) {
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(false)

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

    const handleClear = () => {
        setText('')
        props.showAlert('Text cleared', 'success')
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(text)
        props.showAlert('Copied to clipboard', 'success')
    }

    const handlePaste = () => {
        navigator.clipboard.readText().then(t => setText(t))
        props.showAlert('Pasted from clipboard', 'success')
    }

    const handleTts = () => {
        const msg = new SpeechSynthesisUtterance(text)
        window.speechSynthesis.speak(msg)
        props.showAlert('Speaking\u2026', 'info')
    }

    const handleChange = (e) => setText(e.target.value)

    const disabled = text.length === 0 || loading

    const words         = text.split(/\s+/).filter(Boolean).length
    const chars         = text.length
    const charsNoSpaces = text.replace(/\s/g, '').length
    const sentences     = text.split(/[.?]\s*(?=\S|$)|\n/).filter(s => s.trim()).length
    const readingTime   = (words / 125).toFixed(2)

    const stats = [
        { label: 'Words',          value: words         },
        { label: 'Characters',     value: chars         },
        { label: 'No-space chars', value: charsNoSpaces },
        { label: 'Sentences',      value: sentences     },
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
                    10 powerful utilities &mdash; instant results.
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
                    className="tu-textarea"
                    id="text"
                    rows="10"
                    value={text}
                    onChange={handleChange}
                    placeholder="Start typing or paste your text here\u2026"
                />

                <div className="tu-actions">
                    {/* Case transformations */}
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
                        </div>
                    </div>

                    {/* Tools */}
                    <div className="tu-action-group">
                        <p className="tu-group-label">Tools</p>
                        <div className="tu-btn-row">
                            <button disabled={disabled} className="tu-btn tu-btn--clip"
                                onClick={handleCopy}>
                                Copy
                            </button>
                            <button disabled={loading} className="tu-btn tu-btn--clip"
                                onClick={handlePaste}>
                                Paste
                            </button>
                            <button disabled={disabled} className="tu-btn tu-btn--amber"
                                onClick={handleTts}>
                                Text to Speech
                            </button>
                            <button disabled={text.length === 0} className="tu-btn tu-btn--danger"
                                onClick={handleClear}>
                                Clear
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
                </div>
                <div className="tu-preview-body">
                    {text.length > 0
                        ? text
                        : <span className="tu-preview-empty">Nothing to preview yet&hellip;</span>
                    }
                </div>
            </div>
        </div>
    )
}
