import React, { useState, useEffect } from 'react'
import * as textService from '../services/textService'

// Hooks
import useFindReplace from '../hooks/useFindReplace'
import useTextCompare from '../hooks/useTextCompare'
import useGenerators from '../hooks/useGenerators'
import useFormatter from '../hooks/useFormatter'
import useAiTools from '../hooks/useAiTools'
import useSpeech from '../hooks/useSpeech'
import useExport from '../hooks/useExport'

// Components
import EditorPanel from './EditorPanel'
import TileGrid from './TileGrid'
import DrawerPanel from './DrawerPanel'
import FindReplaceDrawer from './FindReplaceDrawer'
import CompareDrawer from './CompareDrawer'
import { RandomTextDrawer, PasswordDrawer } from './GeneratorDrawer'
import FormatterDrawer from './FormatterDrawer'

export default function TextForm(props) {
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(false)
    const [dyslexiaMode, setDyslexiaMode] = useState(false)
    const [markdownMode, setMarkdownMode] = useState(false)
    const [activePanel, setActivePanel] = useState(null)

    const showAlert = props.showAlert

    // ── Hooks ──────────────────────────────────────────────────────────────────
    const findReplace = useFindReplace(text, setText, showAlert)
    const compare = useTextCompare(text, showAlert)
    const generators = useGenerators(setText, showAlert)
    const formatter = useFormatter(text, setText, setLoading, showAlert)
    const ai = useAiTools(text, setText, setLoading, setMarkdownMode, showAlert)
    const speech = useSpeech(text, setText, showAlert)
    const exportTools = useExport(text, setLoading, showAlert)

    // ── Shared URL decode on mount ─────────────────────────────────────────────
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const shared = params.get('t')
        if (shared) {
            try { setText(decodeURIComponent(atob(shared))) } catch {}
        }
    }, [])

    // ── Generic API handler ────────────────────────────────────────────────────
    const callApi = async (serviceFn, successMsg) => {
        if (!text) return
        setLoading(true)
        try {
            const data = await serviceFn(text)
            setText(data.result)
            showAlert(successMsg, 'success')
        } catch (err) {
            showAlert(err.message || 'API error', 'danger')
        } finally {
            setLoading(false)
        }
    }

    // ── Clipboard ──────────────────────────────────────────────────────────────
    const handleClear = () => { setText(''); showAlert('Text cleared', 'success') }
    const handleCopy = () => { navigator.clipboard.writeText(text); showAlert('Copied to clipboard', 'success') }
    const handlePaste = () => { navigator.clipboard.readText().then(t => setText(prev => prev + t)); showAlert('Pasted from clipboard', 'success') }
    const handleClearPaste = () => { navigator.clipboard.readText().then(t => setText(t)); showAlert('Cleared and pasted', 'success') }

    // ── Encoding ───────────────────────────────────────────────────────────────
    const handleBase64Encode = () => callApi(textService.base64Encode, 'Base64 encoded')
    const handleBase64Decode = () => callApi(textService.base64Decode, 'Base64 decoded')
    const handleUrlEncode    = () => callApi(textService.urlEncode,    'URL encoded')
    const handleUrlDecode    = () => callApi(textService.urlDecode,    'URL decoded')

    // ── Text Tools ─────────────────────────────────────────────────────────────
    const handleReverseText      = () => callApi(textService.reverseText,          'Text reversed')
    const handleSortAsc          = () => callApi(textService.sortLinesAsc,         'Lines sorted A → Z')
    const handleSortDesc         = () => callApi(textService.sortLinesDesc,        'Lines sorted Z → A')
    const handleRemoveDuplicates = () => callApi(textService.removeDuplicateLines, 'Duplicate lines removed')

    // ── Developer Tools ────────────────────────────────────────────────────────
    const handleJsonFormat = () => callApi(textService.formatJson, 'JSON formatted')
    const handleJsonToYaml = () => callApi(textService.jsonToYaml, 'Converted to YAML')

    // ── Accessibility ──────────────────────────────────────────────────────────
    const handleDyslexiaMode = () => {
        setDyslexiaMode(prev => { showAlert(!prev ? 'Dyslexia font on' : 'Dyslexia font off', 'info'); return !prev })
    }
    const handleMarkdownMode = () => {
        setMarkdownMode(prev => { showAlert(!prev ? 'Markdown preview on' : 'Markdown preview off', 'info'); return !prev })
    }

    // ── Derived stats ──────────────────────────────────────────────────────────
    const disabled = text.length === 0 || loading
    const words         = text.split(/\s+/).filter(Boolean).length
    const chars         = text.length
    const charsNoSpaces = text.replace(/\s/g, '').length
    const sentences     = text.split(/[.?]\s*(?=\S|$)|\n/).filter(s => s.trim()).length

    const togglePanel = (panel) => setActivePanel(prev => prev === panel ? null : panel)

    // ── Drawer panels ──────────────────────────────────────────────────────────
    const DRAWERS = {
        find:     { title: 'Find & Replace',        color: 'teal' },
        compare:  { title: 'Text Compare',          color: 'purple' },
        randtext: { title: 'Random Text Generator',  color: 'amber' },
        password: { title: 'Password Generator',     color: 'amber' },
        fmt:      { title: 'Formatter Settings',     color: 'slate' },
    }

    const renderDrawerContent = () => {
        switch (activePanel) {
            case 'find': return <FindReplaceDrawer {...findReplace} disabled={disabled} />
            case 'compare': return <CompareDrawer {...compare} disabled={disabled} />
            case 'randtext': return <RandomTextDrawer {...generators} />
            case 'password': return <PasswordDrawer {...generators} showAlert={showAlert} />
            case 'fmt': return (
                <FormatterDrawer
                    pendingFmtCfg={formatter.pendingFmtCfg}
                    setPendingFmt={formatter.setPendingFmt}
                    setPendingFmtCfg={formatter.setPendingFmtCfg}
                    defaultFmtCfg={formatter.defaultFmtCfg}
                    fmtCfg={formatter.fmtCfg}
                    disabled={disabled}
                    handleFmtApply={formatter.handleFmtApply}
                    setActivePanel={setActivePanel}
                />
            )
            default: return null
        }
    }

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
                <p className="tu-hero-sub">Powerful utilities &mdash; instant results.</p>
            </div>

            {/* Editor card */}
            <div className="tu-editor-card">
                <div className="tu-editor-topbar">
                    <div className="tu-dots"><span /><span /><span /></div>
                    <span className="tu-editor-label">Text Editor</span>
                    <div className="tu-topbar-stats">
                        <span className="tu-topbar-stat"><b>{words}</b> words</span>
                        <span className="tu-topbar-stat"><b>{chars}</b> chars</span>
                        <span className="tu-topbar-stat"><b>{charsNoSpaces}</b> no-space</span>
                        <span className="tu-topbar-stat"><b>{sentences}</b> sentences</span>
                        <span className="tu-topbar-stat"><b>{(words / 125).toFixed(1)}</b> min read</span>
                    </div>
                </div>

                <EditorPanel
                    text={text} setText={setText}
                    markdownMode={markdownMode} dyslexiaMode={dyslexiaMode}
                    loading={loading} fmtCfg={formatter.fmtCfg}
                    aiResult={ai.aiResult} hasMarkdown={ai.hasMarkdown}
                    onAiAccept={ai.handleAiAccept} onAiDismiss={ai.handleAiDismiss}
                    showAlert={showAlert}
                />

                <TileGrid
                    disabled={disabled}
                    activePanel={activePanel}
                    togglePanel={togglePanel}
                    listening={speech.listening}
                    callApi={callApi}
                    textService={textService}
                    ai={ai}
                    handleReverseText={handleReverseText}
                    handleSortAsc={handleSortAsc}
                    handleSortDesc={handleSortDesc}
                    handleRemoveDuplicates={handleRemoveDuplicates}
                    handleBase64Encode={handleBase64Encode}
                    handleBase64Decode={handleBase64Decode}
                    handleUrlEncode={handleUrlEncode}
                    handleUrlDecode={handleUrlDecode}
                    handleJsonFormat={handleJsonFormat}
                    handleJsonToYaml={handleJsonToYaml}
                    handleFormatHtml={formatter.handleFormatHtml}
                    handleFormatCss={formatter.handleFormatCss}
                    handleFormatJs={formatter.handleFormatJs}
                    handleFormatTs={formatter.handleFormatTs}
                    handleCopy={handleCopy}
                    handlePaste={handlePaste}
                    handleClearPaste={handleClearPaste}
                    handleClear={handleClear}
                    handleTts={speech.handleTts}
                    handleSpeechToText={speech.handleSpeechToText}
                    handleDyslexiaMode={handleDyslexiaMode}
                    handleMarkdownMode={handleMarkdownMode}
                    handleDownloadTxt={exportTools.handleDownloadTxt}
                    handleDownloadPdf={exportTools.handleDownloadPdf}
                    handleDownloadDocx={exportTools.handleDownloadDocx}
                    handleDownloadJson={exportTools.handleDownloadJson}
                    handleShare={exportTools.handleShare}
                    dyslexiaMode={dyslexiaMode}
                    markdownMode={markdownMode}
                />

                {activePanel && DRAWERS[activePanel] && (
                    <DrawerPanel
                        title={DRAWERS[activePanel].title}
                        color={DRAWERS[activePanel].color}
                        onClose={() => setActivePanel(null)}
                    >
                        {renderDrawerContent()}
                    </DrawerPanel>
                )}
            </div>
        </div>
    )
}
