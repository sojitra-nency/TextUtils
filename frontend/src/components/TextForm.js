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
import useRegexTester from '../hooks/useRegexTester'

// Components
import EditorPanel from './EditorPanel'
import TileGrid from './TileGrid'
import DrawerPanel from './DrawerPanel'
import FindReplaceDrawer from './FindReplaceDrawer'
import CompareDrawer from './CompareDrawer'
import { RandomTextDrawer, PasswordDrawer } from './GeneratorDrawer'
import FormatterDrawer from './FormatterDrawer'
import RegexDrawer from './RegexDrawer'

export default function TextForm(props) {
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(false)
    const [dyslexiaMode, setDyslexiaMode] = useState(false)
    const [markdownMode, setMarkdownMode] = useState(false)
    const [activePanel, setActivePanel] = useState(null)
    const [previewMode, setPreviewMode] = useState(null) // 'result' | 'dyslexia' | 'markdown'

    const showAlert = props.showAlert

    // ── Hooks ──────────────────────────────────────────────────────────────────
    const findReplace = useFindReplace(text, setText, showAlert)
    const compare = useTextCompare(text, showAlert)
    const generators = useGenerators(setText, showAlert)
    const formatter = useFormatter(text, setText, setLoading, showAlert)
    const ai = useAiTools(text, setText, setLoading, setMarkdownMode, setPreviewMode, showAlert)
    const speech = useSpeech(text, setText, showAlert)
    const exportTools = useExport(text, setLoading, showAlert)
    const regex = useRegexTester(text, showAlert)

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
            ai.setAiResult({ label: successMsg, result: data.result })
            setPreviewMode('result')
            showAlert(successMsg, 'success')
        } catch (err) {
            showAlert(err.message || 'API error', 'danger')
        } finally {
            setLoading(false)
        }
    }

    // ── Clipboard ──────────────────────────────────────────────────────────────
    const handleClear = () => { setText(''); ai.setAiResult(null); setPreviewMode(null); showAlert('Text cleared', 'success') }
    const handleCopy = () => { navigator.clipboard.writeText(text); showAlert('Copied to clipboard', 'success') }
    const handlePaste = () => { navigator.clipboard.readText().then(t => setText(prev => prev + t)); showAlert('Pasted from clipboard', 'success') }
    const handleClearPaste = () => { navigator.clipboard.readText().then(t => setText(t)); showAlert('Cleared and pasted', 'success') }

    // ── Encoding ───────────────────────────────────────────────────────────────
    const handleBase64Encode = () => callApi(textService.base64Encode, 'Base64 encoded')
    const handleBase64Decode = () => callApi(textService.base64Decode, 'Base64 decoded')
    const handleUrlEncode    = () => callApi(textService.urlEncode,    'URL encoded')
    const handleUrlDecode    = () => callApi(textService.urlDecode,    'URL decoded')
    const handleHexEncode    = () => callApi(textService.hexEncode,    'Hex encoded')
    const handleHexDecode    = () => callApi(textService.hexDecode,    'Hex decoded')
    const handleMorseEncode  = () => callApi(textService.morseEncode,  'Morse encoded')
    const handleMorseDecode  = () => callApi(textService.morseDecode,  'Morse decoded')

    // ── Hashing (client-side) ────────────────────────────────────────────────
    const handleSha256 = async () => {
        if (!text) return
        setLoading(true)
        try {
            const data = new TextEncoder().encode(text)
            const buf = await crypto.subtle.digest('SHA-256', data)
            const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
            ai.setAiResult({ label: 'SHA-256 Hash', result: hash })
            setPreviewMode('result')
            showAlert('SHA-256 hash generated', 'success')
        } catch { showAlert('SHA-256 hashing failed', 'danger') }
        finally { setLoading(false) }
    }

    const handleMd5 = async () => {
        if (!text) return
        setLoading(true)
        try {
            const md5Module = await import('blueimp-md5')
            const hash = md5Module.default(text)
            ai.setAiResult({ label: 'MD5 Hash', result: hash })
            setPreviewMode('result')
            showAlert('MD5 hash generated', 'success')
        } catch { showAlert('MD5 hashing failed', 'danger') }
        finally { setLoading(false) }
    }

    // ── Text Tools ─────────────────────────────────────────────────────────────
    const handleReverseText      = () => callApi(textService.reverseText,          'Text reversed')
    const handleSortAsc          = () => callApi(textService.sortLinesAsc,         'Lines sorted A → Z')
    const handleSortDesc         = () => callApi(textService.sortLinesDesc,        'Lines sorted Z → A')
    const handleRemoveDuplicates = () => callApi(textService.removeDuplicateLines, 'Duplicate lines removed')
    const handleReverseLines     = () => callApi(textService.reverseLines,        'Lines reversed')
    const handleNumberLines      = () => callApi(textService.numberLines,         'Lines numbered')
    const handleRot13            = () => callApi(textService.rot13,               'ROT13 applied')

    // ── Escape / Unescape ──────────────────────────────────────────────────────
    const handleJsonEscape   = () => callApi(textService.jsonEscape,   'JSON escaped')
    const handleJsonUnescape = () => callApi(textService.jsonUnescape, 'JSON unescaped')
    const handleHtmlEscape   = () => callApi(textService.htmlEscape,   'HTML escaped')
    const handleHtmlUnescape = () => callApi(textService.htmlUnescape, 'HTML unescaped')

    // ── Developer Tools ────────────────────────────────────────────────────────
    const handleJsonFormat = () => callApi(textService.formatJson, 'JSON formatted')
    const handleJsonToYaml = () => callApi(textService.jsonToYaml, 'Converted to YAML')
    const handleCsvToJson  = () => callApi(textService.csvToJson,  'CSV converted to JSON')
    const handleJsonToCsv  = () => callApi(textService.jsonToCsv,  'JSON converted to CSV')

    // ── JWT Decoder (client-side) ────────────────────────────────────────────
    const handleJwtDecode = () => {
        if (!text) return
        setLoading(true)
        try {
            const cleaned = text.trim().replace(/\s+/g, '')
            const parts = cleaned.split('.')
            if (parts.length !== 3) throw new Error('Invalid JWT: expected 3 dot-separated parts')
            const decode = (s, label) => {
                if (!/^[A-Za-z0-9_-]+$/.test(s)) throw new Error(`Invalid characters in JWT ${label}`)
                const padded = s + '='.repeat((4 - s.length % 4) % 4)
                let binary
                try { binary = atob(padded.replace(/-/g, '+').replace(/_/g, '/')) }
                catch { throw new Error(`Invalid base64 in JWT ${label}`) }
                const jsonStr = new TextDecoder().decode(Uint8Array.from(binary, c => c.charCodeAt(0)))
                try { return JSON.parse(jsonStr) }
                catch { throw new Error(`JWT ${label} is not valid JSON`) }
            }
            const header = decode(parts[0], 'header')
            const payload = decode(parts[1], 'payload')
            const result = `=== HEADER ===\n${JSON.stringify(header, null, 2)}\n\n=== PAYLOAD ===\n${JSON.stringify(payload, null, 2)}`
            ai.setAiResult({ label: 'JWT Decoded', result })
            setPreviewMode('result')
            showAlert('JWT decoded', 'success')
        } catch (err) { showAlert(err.message || 'Invalid JWT token', 'danger') }
        finally { setLoading(false) }
    }

    // ── Accessibility ──────────────────────────────────────────────────────────
    const handleDyslexiaMode = () => {
        setDyslexiaMode(prev => {
            const next = !prev
            showAlert(next ? 'Dyslexia font on' : 'Dyslexia font off', 'info')
            if (next) setPreviewMode('dyslexia')
            else if (previewMode === 'dyslexia') setPreviewMode(null)
            return next
        })
    }
    const handleMarkdownMode = () => {
        setMarkdownMode(prev => {
            const next = !prev
            showAlert(next ? 'Markdown preview on' : 'Markdown preview off', 'info')
            if (next) setPreviewMode('markdown')
            else if (previewMode === 'markdown') setPreviewMode(null)
            return next
        })
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
        regex:    { title: 'Regex Tester',            color: 'teal' },
    }

    const renderDrawerContent = () => {
        switch (activePanel) {
            case 'find': return <FindReplaceDrawer {...findReplace} disabled={disabled} />
            case 'compare': return <CompareDrawer {...compare} disabled={disabled} />
            case 'randtext': return <RandomTextDrawer {...generators} />
            case 'password': return <PasswordDrawer {...generators} showAlert={showAlert} />
            case 'regex': return <RegexDrawer {...regex} disabled={disabled} />
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
                    previewMode={previewMode} setPreviewMode={setPreviewMode}
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
                    handleReverseLines={handleReverseLines}
                    handleNumberLines={handleNumberLines}
                    handleRot13={handleRot13}
                    handleSortAsc={handleSortAsc}
                    handleSortDesc={handleSortDesc}
                    handleRemoveDuplicates={handleRemoveDuplicates}
                    handleBase64Encode={handleBase64Encode}
                    handleBase64Decode={handleBase64Decode}
                    handleUrlEncode={handleUrlEncode}
                    handleUrlDecode={handleUrlDecode}
                    handleHexEncode={handleHexEncode}
                    handleHexDecode={handleHexDecode}
                    handleMorseEncode={handleMorseEncode}
                    handleMorseDecode={handleMorseDecode}
                    handleMd5={handleMd5}
                    handleSha256={handleSha256}
                    handleJsonEscape={handleJsonEscape}
                    handleJsonUnescape={handleJsonUnescape}
                    handleHtmlEscape={handleHtmlEscape}
                    handleHtmlUnescape={handleHtmlUnescape}
                    handleJsonFormat={handleJsonFormat}
                    handleJsonToYaml={handleJsonToYaml}
                    handleCsvToJson={handleCsvToJson}
                    handleJsonToCsv={handleJsonToCsv}
                    handleJwtDecode={handleJwtDecode}
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
