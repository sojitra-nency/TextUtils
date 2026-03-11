import React from 'react'
import { marked } from 'marked'

export default function EditorPanel({
    text, setText, markdownMode, dyslexiaMode, loading, fmtCfg,
    aiResult, hasMarkdown, onAiAccept, onAiDismiss,
    previewMode, setPreviewMode, showAlert,
}) {
    const handleDismiss = () => {
        onAiDismiss()
        setPreviewMode(null)
    }

    const handleAccept = () => {
        onAiAccept()
        setPreviewMode(null)
    }

    const handleChange = (e) => {
        setText(e.target.value)
        if (previewMode === 'result') { onAiDismiss(); setPreviewMode(null) }
    }

    // Determine which panel to show based on most recent action
    const showResult   = previewMode === 'result' && aiResult
    const showDyslexia = previewMode === 'dyslexia' && dyslexiaMode && text
    const showMarkdown = previewMode === 'markdown' && markdownMode && text

    return (
        <>
            <textarea
                className="tu-textarea"
                id="text"
                rows="10"
                value={text}
                onChange={handleChange}
                placeholder="Start typing or paste your text here…"
                style={{ tabSize: fmtCfg.tabWidth, MozTabSize: fmtCfg.tabWidth }}
            />

            {loading && (
                <div className="tu-loading">
                    <div className="tu-spinner" />
                    <span>Processing…</span>
                </div>
            )}

            {showResult ? (
                <div className="tu-ai-panel">
                    <div className="tu-ai-panel-header">
                        <span className="tu-ai-panel-label">{aiResult.label}</span>
                        <div className="tu-ai-panel-actions">
                            <button className="tu-btn tu-btn--ai-accept" onClick={handleAccept}>
                                ✓ Accept
                            </button>
                            <button className="tu-btn tu-btn--ai-copy" onClick={() => { navigator.clipboard.writeText(aiResult.result); showAlert('Result copied', 'success') }}>
                                ⧉ Copy
                            </button>
                            <button className="tu-btn tu-btn--ai-dismiss" onClick={handleDismiss}>
                                ✕
                            </button>
                        </div>
                    </div>
                    <div className="tu-ai-panel-body">
                        {hasMarkdown(aiResult.result)
                            ? <div className="tu-preview-markdown" dangerouslySetInnerHTML={{ __html: marked.parse(aiResult.result) }} />
                            : <span style={{ whiteSpace: 'pre-wrap' }}>{aiResult.result}</span>
                        }
                    </div>
                </div>
            ) : showDyslexia ? (
                <div className="tu-ai-panel">
                    <div className="tu-ai-panel-header">
                        <span className="tu-ai-panel-label">Dyslexia-Friendly Preview</span>
                    </div>
                    <div className="tu-ai-panel-body">
                        <span className="tu-dyslexia" style={{ whiteSpace: 'pre-wrap' }}>{text}</span>
                    </div>
                </div>
            ) : showMarkdown ? (
                <div className="tu-ai-panel">
                    <div className="tu-ai-panel-header">
                        <span className="tu-ai-panel-label">Markdown Preview</span>
                    </div>
                    <div className="tu-ai-panel-body">
                        <div className="tu-preview-markdown" dangerouslySetInnerHTML={{ __html: marked.parse(text) }} />
                    </div>
                </div>
            ) : null}
        </>
    )
}
