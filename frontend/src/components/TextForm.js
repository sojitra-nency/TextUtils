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
    const [aiResult, setAiResult] = useState(null)   // { label, result }


    // Unified drawer state: null | 'find' | 'fmt' | 'compare' | 'randtext' | 'password'
    const [activePanel, setActivePanel] = useState(null)

    // Find & Replace
    const [findText, setFindText]                   = useState('')
    const [replaceText, setReplaceText]             = useState('')
    const [findCaseSensitive, setFindCaseSensitive] = useState(false)
    const [findUseRegex, setFindUseRegex]           = useState(false)
    const [replaceCount, setReplaceCount]           = useState(null)

    // Text Compare
    const [compareText, setCompareText] = useState('')
    const [diffResult, setDiffResult]   = useState(null)

    // Generators
    const [textGenType, setTextGenType]   = useState('words')
    const [textGenCount, setTextGenCount] = useState(50)
    const [pwdLen, setPwdLen]             = useState(16)
    const [pwdOpts, setPwdOpts]           = useState({ upper: true, lower: true, numbers: true, symbols: true })
    const [generatedPwd, setGeneratedPwd] = useState('')
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


    // ── AI Tools ─────────────────────────────────────────────────────────────────
    const callAi = async (serviceFn, label, errorMsg) => {
        if (!text) return
        setLoading(true)
        try {
            const data = await serviceFn(text)
            setAiResult({ label, result: data.result })
            props.showAlert(`${label} generated`, 'success')
        } catch (err) {
            props.showAlert(err.message || errorMsg, 'danger')
        } finally {
            setLoading(false)
        }
    }

    const handleHashtags        = () => callAi(textService.generateHashtags,        'Hashtags',          'Hashtag generation failed')
    const handleSeoTitles       = () => callAi(textService.generateSeoTitles,       'SEO Titles',        'SEO title generation failed')
    const handleMetaDescriptions = () => callAi(textService.generateMetaDescriptions, 'Meta Descriptions', 'Meta description generation failed')
    const handleBlogOutline     = () => callAi(textService.generateBlogOutline,     'Blog Outline',      'Blog outline generation failed')
    const handleTweetShorten    = () => callAi(textService.shortenForTweet,         'Tweet',             'Tweet shortening failed')
    const handleEmailRewrite   = () => callAi(textService.rewriteEmail,            'Email',             'Email rewriting failed')

    const handleAiAccept = () => {
        if (aiResult) {
            setText(aiResult.result)
            setAiResult(null)
        }
    }

    const handleAiDismiss = () => setAiResult(null)

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

    // ── Text Tools ────────────────────────────────────────────────────────────
    const handleReverseText      = () => callApi(textService.reverseText,          'Text reversed')
    const handleSortAsc          = () => callApi(textService.sortLinesAsc,         'Lines sorted A → Z')
    const handleSortDesc         = () => callApi(textService.sortLinesDesc,        'Lines sorted Z → A')
    const handleRemoveDuplicates = () => callApi(textService.removeDuplicateLines, 'Duplicate lines removed')

    const handleReplaceAll = () => {
        if (!findText) { props.showAlert('Enter a search term', 'danger'); return }
        try {
            let count = 0
            let result
            if (findUseRegex) {
                const flags = findCaseSensitive ? 'g' : 'gi'
                const re = new RegExp(findText, flags)
                result = text.replace(re, (m) => { count++; return replaceText })
            } else {
                const flags = findCaseSensitive ? 'g' : 'gi'
                const re = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags)
                result = text.replace(re, () => { count++; return replaceText })
            }
            setText(result)
            setReplaceCount(count)
            props.showAlert(`Replaced ${count} occurrence${count !== 1 ? 's' : ''}`, count ? 'success' : 'info')
        } catch (err) {
            props.showAlert('Invalid regex: ' + err.message, 'danger')
        }
    }

    // LCS-based line diff
    const lineDiff = (aLines, bLines) => {
        const m = aLines.length, n = bLines.length
        const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
        for (let i = 1; i <= m; i++)
            for (let j = 1; j <= n; j++)
                dp[i][j] = aLines[i-1] === bLines[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1])
        const result = []
        let i = m, j = n
        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && aLines[i-1] === bLines[j-1]) {
                result.unshift({ type: 'same', line: aLines[i-1] }); i--; j--
            } else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) {
                result.unshift({ type: 'added', line: bLines[j-1] }); j--
            } else {
                result.unshift({ type: 'removed', line: aLines[i-1] }); i--
            }
        }
        return result
    }

    const handleCompare = () => {
        if (!text || !compareText) { props.showAlert('Both text fields must have content', 'danger'); return }
        const aLines = text.split('\n'), bLines = compareText.split('\n')
        if (aLines.length + bLines.length > 2000) { props.showAlert('Text too large to diff (max ~1000 lines each)', 'danger'); return }
        setDiffResult(lineDiff(aLines, bLines))
    }

    // Random Text Generator (lorem ipsum style)
    const LOREM = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ')
    const randWord = () => LOREM[Math.floor(Math.random() * LOREM.length)]
    const randSentence = () => {
        const len = 6 + Math.floor(Math.random() * 10)
        const words = Array.from({ length: len }, randWord)
        words[0] = words[0][0].toUpperCase() + words[0].slice(1)
        return words.join(' ') + '.'
    }
    const handleGenerateText = () => {
        let result
        if (textGenType === 'words') {
            result = Array.from({ length: textGenCount }, randWord).join(' ')
        } else if (textGenType === 'sentences') {
            result = Array.from({ length: textGenCount }, randSentence).join(' ')
        } else {
            result = Array.from({ length: textGenCount }, () => {
                const sentCount = 4 + Math.floor(Math.random() * 4)
                return Array.from({ length: sentCount }, randSentence).join(' ')
            }).join('\n\n')
        }
        setText(result)
        props.showAlert('Random text generated', 'success')
    }

    // Password Generator
    const handleGeneratePassword = () => {
        const pools = []
        if (pwdOpts.upper)   pools.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
        if (pwdOpts.lower)   pools.push('abcdefghijklmnopqrstuvwxyz')
        if (pwdOpts.numbers) pools.push('0123456789')
        if (pwdOpts.symbols) pools.push('!@#$%^&*()-_=+[]{}|;:,.<>?')
        if (!pools.length) { props.showAlert('Select at least one character type', 'danger'); return }
        const chars = pools.join('')
        const arr = new Uint32Array(pwdLen)
        crypto.getRandomValues(arr)
        setGeneratedPwd(Array.from(arr).map(x => chars[x % chars.length]).join(''))
        props.showAlert('Password generated', 'success')
    }

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

    const words         = text.split(/\s+/).filter(Boolean).length
    const chars         = text.length
    const charsNoSpaces = text.replace(/\s/g, '').length
    const sentences     = text.split(/[.?]\s*(?=\S|$)|\n/).filter(s => s.trim()).length

    // ── Tile helper ────────────────────────────────────────────────────────────
    const togglePanel = (panel) => setActivePanel(prev => prev === panel ? null : panel)

    const Tile = ({ icon, label, onClick, color, active, disabled: dis }) => (
        <button
            className={`tu-tile tu-tile--${color}${active ? ' tu-tile--active' : ''}`}
            onClick={onClick}
            disabled={dis || false}
            title={label}
        >
            <span className="tu-tile-icon">{icon}</span>
            <span className="tu-tile-label">{label}</span>
        </button>
    )

    // ── Drawer content renderer ────────────────────────────────────────────────
    const renderDrawer = () => {
        if (!activePanel) return null

        const panels = {
            find: {
                title: 'Find & Replace',
                color: 'teal',
                content: (
                    <div className="tu-find-inputs">
                        <input className="tu-find-input" placeholder="Find…"
                            value={findText} onChange={e => { setFindText(e.target.value); setReplaceCount(null) }} />
                        <input className="tu-find-input" placeholder="Replace with…"
                            value={replaceText} onChange={e => setReplaceText(e.target.value)} />
                        <div className="tu-find-footer">
                            <div className="tu-find-flags">
                                <label className="tu-fmt-check">
                                    <input type="checkbox" checked={findCaseSensitive}
                                        onChange={e => setFindCaseSensitive(e.target.checked)} />
                                    Case-sensitive
                                </label>
                                <label className="tu-fmt-check">
                                    <input type="checkbox" checked={findUseRegex}
                                        onChange={e => setFindUseRegex(e.target.checked)} />
                                    Regex
                                </label>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {replaceCount !== null && (
                                    <span className="tu-find-count">{replaceCount} replaced</span>
                                )}
                                <button className="tu-btn tu-btn--tools" disabled={disabled}
                                    onClick={handleReplaceAll}>Replace All</button>
                            </div>
                        </div>
                    </div>
                )
            },
            compare: {
                title: 'Text Compare',
                color: 'purple',
                content: (
                    <div style={{ padding: '0.85rem 1.1rem' }}>
                        <textarea className="tu-textarea" rows="5" placeholder="Paste comparison text here…"
                            value={compareText} onChange={e => { setCompareText(e.target.value); setDiffResult(null) }}
                            style={{ minHeight: 100, border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '0.6rem 0.85rem' }} />
                        <div style={{ marginTop: '0.6rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="tu-btn tu-btn--compare" disabled={disabled || !compareText}
                                onClick={handleCompare}>Compare</button>
                        </div>
                        {diffResult && (
                            <div className="tu-diff-output" style={{ marginTop: '0.85rem' }}>
                                <div className="tu-diff-legend">
                                    <span className="tu-diff-badge tu-diff-badge--added">+ Added</span>
                                    <span className="tu-diff-badge tu-diff-badge--removed">− Removed</span>
                                    <span className="tu-diff-badge tu-diff-badge--same">= Same</span>
                                    <span className="tu-diff-stats">
                                        {diffResult.filter(d => d.type === 'added').length} added &nbsp;·&nbsp;
                                        {diffResult.filter(d => d.type === 'removed').length} removed
                                    </span>
                                </div>
                                {diffResult.map((d, idx) => (
                                    <div key={idx} className={`tu-diff-line tu-diff-line--${d.type}`}>
                                        <span className="tu-diff-marker">
                                            {d.type === 'added' ? '+' : d.type === 'removed' ? '−' : ' '}
                                        </span>
                                        <span className="tu-diff-text">{d.line || '\u00A0'}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )
            },
            randtext: {
                title: 'Random Text Generator',
                color: 'amber',
                content: (
                    <div style={{ padding: '0.85rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div className="tu-gen-row">
                            <label className="tu-fmt-check">
                                <input type="radio" name="tgt" value="words" checked={textGenType === 'words'}
                                    onChange={() => setTextGenType('words')} /> Words
                            </label>
                            <label className="tu-fmt-check">
                                <input type="radio" name="tgt" value="sentences" checked={textGenType === 'sentences'}
                                    onChange={() => setTextGenType('sentences')} /> Sentences
                            </label>
                            <label className="tu-fmt-check">
                                <input type="radio" name="tgt" value="paragraphs" checked={textGenType === 'paragraphs'}
                                    onChange={() => setTextGenType('paragraphs')} /> Paragraphs
                            </label>
                        </div>
                        <div className="tu-gen-row">
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>Count:</span>
                            <input type="number" className="tu-gen-number" min="1" max="10000"
                                value={textGenCount}
                                onChange={e => {
                                    const v = Math.min(10000, Math.max(1, Number(e.target.value)))
                                    setTextGenCount(v)
                                }} />
                            {textGenCount >= 10000 && (
                                <span style={{ fontSize: '0.72rem', color: 'var(--amber)', fontWeight: 600 }}>
                                    ⚠ Max limit reached
                                </span>
                            )}
                            <button className="tu-btn tu-btn--gen" onClick={handleGenerateText}>Generate</button>
                        </div>
                    </div>
                )
            },
            password: {
                title: 'Password Generator',
                color: 'amber',
                content: (
                    <div style={{ padding: '0.85rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div className="tu-gen-row">
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>Length:</span>
                            <input type="number" className="tu-gen-number" min="4" max="128"
                                value={pwdLen} onChange={e => setPwdLen(Number(e.target.value))} />
                        </div>
                        <div className="tu-gen-row" style={{ flexWrap: 'wrap', gap: '0.5rem 1.25rem' }}>
                            {[['upper','A–Z'],['lower','a–z'],['numbers','0–9'],['symbols','!@#…']].map(([k, lbl]) => (
                                <label key={k} className="tu-fmt-check">
                                    <input type="checkbox" checked={pwdOpts[k]}
                                        onChange={e => setPwdOpts(o => ({ ...o, [k]: e.target.checked }))} />
                                    {lbl}
                                </label>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="tu-btn tu-btn--gen" onClick={handleGeneratePassword}>Generate</button>
                        </div>
                        {generatedPwd && (
                            <div className="tu-pwd-output">
                                <span className="tu-pwd-value">{generatedPwd}</span>
                                <button className="tu-btn tu-btn--clip" style={{ flexShrink: 0 }}
                                    onClick={() => { navigator.clipboard.writeText(generatedPwd); props.showAlert('Password copied', 'success') }}>
                                    Copy
                                </button>
                            </div>
                        )}
                    </div>
                )
            },
            fmt: {
                title: 'Formatter Settings',
                color: 'slate',
                content: (
                    <div>
                        <div className="tu-fmt-section-label">Indentation</div>
                        <div className="tu-fmt-grid">
                            <label className="tu-fmt-field">
                                <span>Tab width</span>
                                <select value={pendingFmtCfg.tabWidth} onChange={e => setPendingFmt({ tabWidth: Number(e.target.value) })}>
                                    {[2, 4].map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </label>
                            <label className="tu-fmt-check">
                                <input type="checkbox" checked={pendingFmtCfg.useTabs}
                                    onChange={e => setPendingFmt({ useTabs: e.target.checked })} />
                                Use tabs
                            </label>
                        </div>
                        <div className="tu-fmt-section-label">Syntax</div>
                        <div className="tu-fmt-checks">
                            <label className="tu-fmt-check">
                                <input type="checkbox" checked={pendingFmtCfg.semi}
                                    onChange={e => setPendingFmt({ semi: e.target.checked })} />
                                Semicolons
                            </label>
                            <label className="tu-fmt-check">
                                <input type="checkbox" checked={pendingFmtCfg.singleQuote}
                                    onChange={e => setPendingFmt({ singleQuote: e.target.checked })} />
                                Single quotes
                            </label>
                            <label className="tu-fmt-check">
                                <input type="checkbox" checked={pendingFmtCfg.bracketSpacing}
                                    onChange={e => setPendingFmt({ bracketSpacing: e.target.checked })} />
                                Bracket spacing
                            </label>
                            <label className="tu-fmt-check">
                                <input type="checkbox" checked={pendingFmtCfg.jsxSingleQuote}
                                    onChange={e => setPendingFmt({ jsxSingleQuote: e.target.checked })} />
                                JSX single quotes
                            </label>
                            <label className="tu-fmt-check">
                                <input type="checkbox" checked={pendingFmtCfg.sortImports}
                                    onChange={e => setPendingFmt({ sortImports: e.target.checked })} />
                                Sort imports
                            </label>
                        </div>
                        <div className="tu-fmt-section-label">Trailing commas</div>
                        <div className="tu-fmt-grid">
                            <label className="tu-fmt-field">
                                <select value={pendingFmtCfg.trailingComma}
                                    onChange={e => setPendingFmt({ trailingComma: e.target.value })}>
                                    {['none','es5','all'].map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            </label>
                            <label className="tu-fmt-field">
                                <span>Arrow parens</span>
                                <select value={pendingFmtCfg.arrowParens}
                                    onChange={e => setPendingFmt({ arrowParens: e.target.value })}>
                                    {['always','avoid'].map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            </label>
                        </div>
                        <div className="tu-fmt-presets">
                            <span className="tu-fmt-preset-label">Presets:</span>
                            <button className="tu-btn tu-btn--dev" onClick={() => setPendingFmtCfg({ ...defaultFmtCfg })}>Default</button>
                            <button className="tu-btn tu-btn--dev" onClick={() => setPendingFmtCfg({ ...defaultFmtCfg, singleQuote: true, semi: false, trailingComma: 'all' })}>Airbnb</button>
                            <button className="tu-btn tu-btn--dev" onClick={() => setPendingFmtCfg({ ...defaultFmtCfg, tabWidth: 4, singleQuote: true, semi: false })}>Standard</button>
                        </div>
                        <div className="tu-fmt-actions">
                            <button className="tu-btn tu-btn--dev" onClick={() => { setPendingFmtCfg(fmtCfg); setActivePanel(null) }}>Cancel</button>
                            <button className="tu-btn tu-btn--apply" onClick={() => { setFmtCfg(pendingFmtCfg); setActivePanel(null); props.showAlert('Formatter settings applied', 'success') }}>Apply</button>
                        </div>
                    </div>
                )
            }
        }

        const p = panels[activePanel]
        if (!p) return null

        const drawerColors = {
            teal:   { bg: 'rgba(20,184,166,0.08)',  border: '#14B8A6', text: '#0f766e' },
            purple: { bg: 'rgba(168,85,247,0.08)',  border: '#A855F7', text: '#7c3aed' },
            amber:  { bg: 'rgba(245,158,11,0.08)',  border: '#F59E0B', text: '#b45309' },
            slate:  { bg: 'rgba(99,102,241,0.07)',  border: 'var(--violet)', text: 'var(--violet)' },
        }
        const dc = drawerColors[p.color] || drawerColors.slate

        return (
            <div className="tu-drawer" style={{ borderColor: dc.border }}>
                <div className="tu-drawer-header" style={{ background: dc.bg, borderBottomColor: dc.border }}>
                    <span className="tu-drawer-title" style={{ color: dc.text }}>{p.title}</span>
                    <button className="tu-drawer-close" onClick={() => setActivePanel(null)} title="Close">✕</button>
                </div>
                <div className="tu-drawer-body">{p.content}</div>
            </div>
        )
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
                    {/* Stats chips */}
                    <div className="tu-topbar-stats">
                        <span className="tu-topbar-stat"><b>{words}</b> words</span>
                        <span className="tu-topbar-stat"><b>{chars}</b> chars</span>
                        <span className="tu-topbar-stat"><b>{charsNoSpaces}</b> no-space</span>
                        <span className="tu-topbar-stat"><b>{sentences}</b> sentences</span>
                        <span className="tu-topbar-stat"><b>{(words / 125).toFixed(1)}</b> min read</span>
                    </div>
                </div>

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
                        onChange={handleChange}
                        placeholder="Start typing or paste your text here…"
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
                                <button className="tu-btn tu-btn--ai-accept" onClick={handleAiAccept}>
                                    ✓ Accept
                                </button>
                                <button className="tu-btn tu-btn--ai-copy" onClick={() => { navigator.clipboard.writeText(aiResult.result); props.showAlert('AI result copied', 'success') }}>
                                    ⧉ Copy
                                </button>
                                <button className="tu-btn tu-btn--ai-dismiss" onClick={handleAiDismiss}>
                                    ✕
                                </button>
                            </div>
                        </div>
                        <div className="tu-ai-panel-body">
                            {aiResult.result}
                        </div>
                    </div>
                )}

                {/* ── Tile Grid ────────────────────────────────────────── */}
                <div className="tu-tile-grid">

                    {/* Transform */}
                    <div className="tu-tile-section">
                        <span className="tu-tile-sec-label" style={{ color: '#7C3AED' }}>✦ Transform</span>
                        <div className="tu-tile-row">
                            <Tile icon="AA" label="Uppercase" color="violet" disabled={disabled}
                                onClick={() => callApi(textService.toUpperCase, 'Converted to uppercase')} />
                            <Tile icon="aa" label="Lowercase" color="violet" disabled={disabled}
                                onClick={() => callApi(textService.toLowerCase, 'Converted to lowercase')} />
                            <Tile icon="Tt" label="Title Case" color="violet" disabled={disabled}
                                onClick={() => callApi(textService.toTitleCase, 'Converted to title case')} />
                            <Tile icon="Ss." label="Sentence" color="violet" disabled={disabled}
                                onClick={() => callApi(textService.toSentenceCase, 'Converted to sentence case')} />
                            <Tile icon="aA" label="Toggle" color="violet" disabled={disabled}
                                onClick={() => callApi(textService.toInverseCase, 'Case toggled')} />
                            <Tile icon="PP" label="PascalCase" color="violet" disabled={disabled}
                                onClick={() => callApi(textService.toUpperCamelCase, 'Converted to PascalCase')} />
                            <Tile icon="cc" label="camelCase" color="violet" disabled={disabled}
                                onClick={() => callApi(textService.toLowerCamelCase, 'Converted to camelCase')} />
                        </div>
                    </div>

                    {/* Whitespace */}
                    <div className="tu-tile-section">
                        <span className="tu-tile-sec-label" style={{ color: '#64748B' }}>⎵ Whitespace</span>
                        <div className="tu-tile-row">
                            <Tile icon="⎵→" label="Trim Extra" color="slate" disabled={disabled}
                                onClick={() => callApi(textService.removeExtraSpaces, 'Extra spaces removed')} />
                            <Tile icon="↵✕" label="No Breaks" color="slate" disabled={disabled}
                                onClick={() => callApi(textService.removeLineBreaks, 'Line breaks removed')} />
                            <Tile icon="✕⎵" label="Strip All" color="slate" disabled={disabled}
                                onClick={() => callApi(textService.removeAllSpaces, 'All spaces removed')} />
                            <Tile icon="≡" label="Minify" color="slate" disabled={disabled}
                                onClick={() => callApi(textService.minify, 'Text minified')} />
                        </div>
                    </div>

                    {/* Text Tools */}
                    <div className="tu-tile-section">
                        <span className="tu-tile-sec-label" style={{ color: '#14B8A6' }}>⚙ Text Tools</span>
                        <div className="tu-tile-row">
                            <Tile icon="⟲" label="Reverse" color="teal" disabled={disabled}
                                onClick={handleReverseText} />
                            <Tile icon="A↑Z" label="Sort A→Z" color="teal" disabled={disabled}
                                onClick={handleSortAsc} />
                            <Tile icon="Z↓A" label="Sort Z→A" color="teal" disabled={disabled}
                                onClick={handleSortDesc} />
                            <Tile icon="⊟" label="Deduplicate" color="teal" disabled={disabled}
                                onClick={handleRemoveDuplicates} />
                            <Tile icon="⌕↺" label="Find & Replace" color="teal"
                                active={activePanel === 'find'}
                                onClick={() => togglePanel('find')} />
                        </div>
                    </div>

                    {/* Encoding */}
                    <div className="tu-tile-section">
                        <span className="tu-tile-sec-label" style={{ color: '#6366F1' }}>⇌ Encoding</span>
                        <div className="tu-tile-row">
                            <Tile icon="64↑" label="Base64 Enc" color="indigo" disabled={disabled}
                                onClick={handleBase64Encode} />
                            <Tile icon="64↓" label="Base64 Dec" color="indigo" disabled={disabled}
                                onClick={handleBase64Decode} />
                            <Tile icon="%+" label="URL Encode" color="indigo" disabled={disabled}
                                onClick={handleUrlEncode} />
                            <Tile icon="%-" label="URL Decode" color="indigo" disabled={disabled}
                                onClick={handleUrlDecode} />
                        </div>
                    </div>

                    {/* Developer */}
                    <div className="tu-tile-section">
                        <span className="tu-tile-sec-label" style={{ color: '#475569' }}>{ } Developer</span>
                        <div className="tu-tile-row">
                            <Tile icon="{}" label="JSON Fmt" color="gray" disabled={disabled}
                                onClick={handleJsonFormat} />
                            <Tile icon="→Y" label="JSON→YAML" color="gray" disabled={disabled}
                                onClick={handleJsonToYaml} />
                            <Tile icon="<>" label="HTML Fmt" color="gray" disabled={disabled}
                                onClick={handleFormatHtml} />
                            <Tile icon="#:" label="CSS Fmt" color="gray" disabled={disabled}
                                onClick={handleFormatCss} />
                            <Tile icon="JS" label="JS Fmt" color="gray" disabled={disabled}
                                onClick={handleFormatJs} />
                            <Tile icon="TS" label="TS Fmt" color="gray" disabled={disabled}
                                onClick={handleFormatTs} />
                            <Tile icon="⚙" label="Fmt Settings" color="gray"
                                active={activePanel === 'fmt'}
                                onClick={() => togglePanel('fmt')} />
                        </div>
                    </div>

                    {/* AI Tools */}
                    <div className="tu-tile-section">
                        <span className="tu-tile-sec-label" style={{ color: '#EC4899' }}>✧ AI Tools</span>
                        <div className="tu-tile-row">
                            <Tile icon="#" label="Hashtags" color="pink" disabled={disabled}
                                onClick={handleHashtags} />
                            <Tile icon="SEO" label="SEO Titles" color="pink" disabled={disabled}
                                onClick={handleSeoTitles} />
                            <Tile icon="M:" label="Meta Desc" color="pink" disabled={disabled}
                                onClick={handleMetaDescriptions} />
                            <Tile icon="¶" label="Blog Outline" color="pink" disabled={disabled}
                                onClick={handleBlogOutline} />
                            <Tile icon="✂" label="Tweet Shorten" color="pink" disabled={disabled}
                                onClick={handleTweetShorten} />
                            <Tile icon="✉" label="Email Rewrite" color="pink" disabled={disabled}
                                onClick={handleEmailRewrite} />
                        </div>
                    </div>

                    {/* Compare & Generate */}
                    <div className="tu-tile-section">
                        <span className="tu-tile-sec-label" style={{ color: '#A855F7' }}>◈ Compare & Generate</span>
                        <div className="tu-tile-row">
                            <Tile icon="⇄" label="Compare" color="purple"
                                active={activePanel === 'compare'}
                                onClick={() => togglePanel('compare')} />
                            <Tile icon="¶" label="Random Text" color="amber"
                                active={activePanel === 'randtext'}
                                onClick={() => togglePanel('randtext')} />
                            <Tile icon="⚿" label="Password" color="amber"
                                active={activePanel === 'password'}
                                onClick={() => togglePanel('password')} />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="tu-tile-section">
                        <span className="tu-tile-sec-label" style={{ color: '#10B981' }}>↯ Actions</span>
                        <div className="tu-tile-row">
                            <Tile icon="⧉" label="Copy" color="emerald" disabled={disabled}
                                onClick={handleCopy} />
                            <Tile icon="⊞" label="Paste" color="emerald"
                                onClick={handlePaste} />
                            <Tile icon="⊟⊞" label="Clear+Paste" color="emerald"
                                onClick={handleClearPaste} />
                            <Tile icon="⌫" label="Clear" color="rose" disabled={disabled}
                                onClick={handleClear} />
                            <Tile icon="▶" label="Read Aloud" color="amber" disabled={disabled}
                                onClick={handleTts} />
                            <Tile icon={listening ? '◉' : '◎'} label={listening ? 'Stop Mic' : 'Speech→Text'}
                                color={listening ? 'rose' : 'emerald'}
                                active={listening}
                                onClick={handleSpeechToText} />
                            <Tile icon="Oo" label="Dyslexia" color="violet"
                                active={dyslexiaMode}
                                onClick={handleDyslexiaMode} />
                            <Tile icon="MD" label="Markdown" color="indigo"
                                active={markdownMode}
                                onClick={handleMarkdownMode} />
                            <Tile icon=".txt" label="Save TXT" color="gray" disabled={disabled}
                                onClick={handleDownloadTxt} />
                            <Tile icon=".pdf" label="Save PDF" color="gray" disabled={disabled}
                                onClick={handleDownloadPdf} />
                            <Tile icon=".doc" label="Save DOCX" color="gray" disabled={disabled}
                                onClick={handleDownloadDocx} />
                            <Tile icon="{↓}" label="Save JSON" color="gray" disabled={disabled}
                                onClick={handleDownloadJson} />
                            <Tile icon="↗" label="Share Link" color="indigo" disabled={disabled}
                                onClick={handleShare} />
                        </div>
                    </div>

                    {/* Slide-up Drawer */}
                    {renderDrawer()}

                </div>
            </div>
        </div>
    )
}
