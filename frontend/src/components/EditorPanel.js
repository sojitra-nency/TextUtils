import React from 'react'
import { marked } from 'marked'

export default function EditorPanel({
    text, setText, markdownMode, dyslexiaMode, loading, fmtCfg,
    aiResult, hasMarkdown, onAiAccept, onAiDismiss, showAlert,
}) {
    return (
        <>
            {markdownMode ? (
                <div className="tu-preview-body" style={{ minHeight: 200 }}>
                    {text
                        ? <div className="tu-preview-markdown" dangerouslySetInnerHTML={{ __html: marked.parse(text) }} />
                        : <span className="tu-preview-empty">Markdown preview will appear here…</span>
                    }
                </div>
            ) : (
                <textarea
                    className={`tu-textarea${dyslexiaMode ? ' tu-dyslexia' : ''}`}
                    id="text"
                    rows="10"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Start typing or paste your text here…"
                    style={{ tabSize: fmtCfg.tabWidth, MozTabSize: fmtCfg.tabWidth }}
                />
            )}

            {loading && (
                <div className="tu-loading">
                    <div className="tu-spinner" />
                    <span>Processing…</span>
                </div>
            )}

            {aiResult && (
                <div className="tu-ai-panel">
                    <div className="tu-ai-panel-header">
                        <span className="tu-ai-panel-label">{aiResult.label}</span>
                        <div className="tu-ai-panel-actions">
                            <button className="tu-btn tu-btn--ai-accept" onClick={onAiAccept}>
                                ✓ Accept
                            </button>
                            <button className="tu-btn tu-btn--ai-copy" onClick={() => { navigator.clipboard.writeText(aiResult.result); showAlert('AI result copied', 'success') }}>
                                ⧉ Copy
                            </button>
                            <button className="tu-btn tu-btn--ai-dismiss" onClick={onAiDismiss}>
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
            )}
        </>
    )
}
