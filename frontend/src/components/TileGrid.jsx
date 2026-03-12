import Tile from './Tile'
import { ENDPOINTS } from '../constants/endpoints'

export default function TileGrid({
    disabled, activePanel, togglePanel, listening,
    // API call handler
    callApi,
    // AI handlers
    ai,
    // Text tool handlers
    handleReverseText, handleReverseLines, handleNumberLines, handleRot13,
    handleSortAsc, handleSortDesc, handleRemoveDuplicates,
    // Encoding handlers
    handleBase64Encode, handleBase64Decode, handleUrlEncode, handleUrlDecode,
    handleHexEncode, handleHexDecode, handleMorseEncode, handleMorseDecode,
    handleMd5, handleSha256,
    // Escape handlers
    handleJsonEscape, handleJsonUnescape, handleHtmlEscape, handleHtmlUnescape,
    // Developer handlers
    handleJsonFormat, handleJsonToYaml, handleCsvToJson, handleJsonToCsv,
    handleJwtDecode,
    handleFormatHtml, handleFormatCss, handleFormatJs, handleFormatTs,
    // Action handlers
    handleCopy, handlePaste, handleClearPaste, handleClear,
    handleTts, handleSpeechToText,
    handleDyslexiaMode, handleMarkdownMode,
    handleDownloadTxt, handleDownloadPdf, handleDownloadDocx, handleDownloadJson,
    handleShare,
    handleWordFrequency,
    // State
    dyslexiaMode, markdownMode,
}) {
    return (
        <div className="tu-tile-grid">

            {/* Transform */}
            <div className="tu-tile-section">
                <span className="tu-tile-sec-label" style={{ color: '#7C3AED' }}>✦ Transform</span>
                <div className="tu-tile-row">
                    <Tile icon="AA" label="Uppercase" color="violet" disabled={disabled}
                        onClick={() => callApi(ENDPOINTS.UPPERCASE, 'Converted to uppercase')} />
                    <Tile icon="aa" label="Lowercase" color="violet" disabled={disabled}
                        onClick={() => callApi(ENDPOINTS.LOWERCASE, 'Converted to lowercase')} />
                    <Tile icon="Tt" label="Title Case" color="violet" disabled={disabled}
                        onClick={() => callApi(ENDPOINTS.TITLE_CASE, 'Converted to title case')} />
                    <Tile icon="Ss." label="Sentence" color="violet" disabled={disabled}
                        onClick={() => callApi(ENDPOINTS.SENTENCE_CASE, 'Converted to sentence case')} />
                    <Tile icon="aA" label="Toggle" color="violet" disabled={disabled}
                        onClick={() => callApi(ENDPOINTS.INVERSE_CASE, 'Case toggled')} />
                    <Tile icon="PP" label="PascalCase" color="violet" disabled={disabled}
                        onClick={() => callApi(ENDPOINTS.UPPER_CAMEL_CASE, 'Converted to PascalCase')} />
                    <Tile icon="cc" label="camelCase" color="violet" disabled={disabled}
                        onClick={() => callApi(ENDPOINTS.LOWER_CAMEL_CASE, 'Converted to camelCase')} />
                    <Tile icon="s_c" label="snake_case" color="violet" disabled={disabled}
                        onClick={() => callApi(ENDPOINTS.SNAKE_CASE, 'Converted to snake_case')} />
                    <Tile icon="k-c" label="kebab-case" color="violet" disabled={disabled}
                        onClick={() => callApi(ENDPOINTS.KEBAB_CASE, 'Converted to kebab-case')} />
                </div>
            </div>

            {/* Whitespace */}
            <div className="tu-tile-section">
                <span className="tu-tile-sec-label" style={{ color: '#64748B' }}>⎵ Whitespace</span>
                <div className="tu-tile-row">
                    <Tile icon="⎵→" label="Trim Extra" color="slate" disabled={disabled}
                        onClick={() => callApi(ENDPOINTS.REMOVE_EXTRA_SPACES, 'Extra spaces removed')} />
                    <Tile icon="↵✕" label="No Breaks" color="slate" disabled={disabled}
                        onClick={() => callApi(ENDPOINTS.REMOVE_LINE_BREAKS, 'Line breaks removed')} />
                    <Tile icon="✕⎵" label="Strip All" color="slate" disabled={disabled}
                        onClick={() => callApi(ENDPOINTS.REMOVE_ALL_SPACES, 'All spaces removed')} />
                    <Tile icon="</>" label="Strip HTML" color="slate" disabled={disabled}
                        onClick={() => callApi(ENDPOINTS.STRIP_HTML, 'HTML tags removed')} />
                    <Tile icon="àa" label="No Accents" color="slate" disabled={disabled}
                        onClick={() => callApi(ENDPOINTS.REMOVE_ACCENTS, 'Accents removed')} />
                    <Tile icon='""' label="Toggle Quotes" color="slate" disabled={disabled}
                        onClick={() => callApi(ENDPOINTS.TOGGLE_SMART_QUOTES, 'Quotes toggled')} />
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
                    <Tile icon="⇵" label="Rev Lines" color="teal" disabled={disabled}
                        onClick={handleReverseLines} />
                    <Tile icon="1." label="Number" color="teal" disabled={disabled}
                        onClick={handleNumberLines} />
                    <Tile icon="R13" label="ROT13" color="teal" disabled={disabled}
                        onClick={handleRot13} />
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
                    <Tile icon="0x" label="Hex Enc" color="indigo" disabled={disabled}
                        onClick={handleHexEncode} />
                    <Tile icon="x0" label="Hex Dec" color="indigo" disabled={disabled}
                        onClick={handleHexDecode} />
                    <Tile icon="·—" label="Morse Enc" color="indigo" disabled={disabled}
                        onClick={handleMorseEncode} />
                    <Tile icon="—·" label="Morse Dec" color="indigo" disabled={disabled}
                        onClick={handleMorseDecode} />
                    <Tile icon="#5" label="MD5" color="indigo" disabled={disabled}
                        onClick={handleMd5} />
                    <Tile icon="#2" label="SHA-256" color="indigo" disabled={disabled}
                        onClick={handleSha256} />
                    <Tile icon="J↑" label="JSON Esc" color="indigo" disabled={disabled}
                        onClick={handleJsonEscape} />
                    <Tile icon="J↓" label="JSON Unesc" color="indigo" disabled={disabled}
                        onClick={handleJsonUnescape} />
                    <Tile icon="H↑" label="HTML Esc" color="indigo" disabled={disabled}
                        onClick={handleHtmlEscape} />
                    <Tile icon="H↓" label="HTML Unesc" color="indigo" disabled={disabled}
                        onClick={handleHtmlUnescape} />
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
                    <Tile icon="C→J" label="CSV→JSON" color="gray" disabled={disabled}
                        onClick={handleCsvToJson} />
                    <Tile icon="J→C" label="JSON→CSV" color="gray" disabled={disabled}
                        onClick={handleJsonToCsv} />
                    <Tile icon="JWT" label="JWT Decode" color="gray" disabled={disabled}
                        onClick={handleJwtDecode} />
                    <Tile icon=".*" label="Regex Test" color="gray"
                        active={activePanel === 'regex'}
                        onClick={() => togglePanel('regex')} />
                </div>
            </div>

            {/* AI Tools */}
            <div className="tu-tile-section">
                <span className="tu-tile-sec-label" style={{ color: '#EC4899' }}>✧ AI Tools</span>
                <div className="tu-tile-row">
                    <Tile icon="#" label="Hashtags" color="pink" disabled={disabled}
                        onClick={ai.handleHashtags} />
                    <Tile icon="SEO" label="SEO Titles" color="pink" disabled={disabled}
                        onClick={ai.handleSeoTitles} />
                    <Tile icon="M:" label="Meta Desc" color="pink" disabled={disabled}
                        onClick={ai.handleMetaDescriptions} />
                    <Tile icon="¶" label="Blog Outline" color="pink" disabled={disabled}
                        onClick={ai.handleBlogOutline} />
                    <Tile icon="✂" label="Tweet Shorten" color="pink" disabled={disabled}
                        onClick={ai.handleTweetShorten} />
                    <Tile icon="✉" label="Email Rewrite" color="pink" disabled={disabled}
                        onClick={ai.handleEmailRewrite} />
                    <Tile icon="⊕" label="Keywords" color="pink" disabled={disabled}
                        onClick={ai.handleKeywords} />
                    <Tile icon="Σ" label="Summarize" color="pink" disabled={disabled}
                        onClick={ai.handleSummarize} />
                    <Tile icon="G" label="Fix Grammar" color="pink" disabled={disabled}
                        onClick={ai.handleFixGrammar} />
                    <Tile icon="↻" label="Paraphrase" color="pink" disabled={disabled}
                        onClick={ai.handleParaphrase} />
                    <Tile icon="♡" label="Sentiment" color="pink" disabled={disabled}
                        onClick={ai.handleSentiment} />
                    <Tile icon="⊕" label="Lengthen" color="pink" disabled={disabled}
                        onClick={ai.handleLengthenText} />
                    <Tile icon="5" label="ELI5" color="pink" disabled={disabled}
                        onClick={ai.handleEli5} />
                    <Tile icon="✓" label="Proofread" color="pink" disabled={disabled}
                        onClick={ai.handleProofread} />
                    <Tile icon="H" label="Gen Title" color="pink" disabled={disabled}
                        onClick={ai.handleGenerateTitle} />
                    <Tile icon="↹" label="Refactor Prompt" color="pink" disabled={disabled}
                        onClick={ai.handleRefactorPrompt} />
                    <div className="tu-tile-translate">
                        <select className="tu-translate-select" value={ai.formatSetting}
                            onChange={e => ai.setFormatSetting(e.target.value)}>
                            {[
                                ['paragraph','Paragraph'],
                                ['bullets','Bullet Points'],
                                ['paragraph-bullets','Para + Points'],
                                ['numbered','Numbered List'],
                                ['qna','Q&A'],
                                ['table','Table'],
                                ['tldr','TL;DR + Detail'],
                                ['headings','With Headings'],
                            ].map(([v,l]) => (
                                <option key={v} value={v}>{l}</option>
                            ))}
                        </select>
                        <Tile icon="⬡" label="Format" color="pink" disabled={disabled}
                            onClick={ai.handleChangeFormat} />
                    </div>
                    <div className="tu-tile-translate">
                        <select className="tu-translate-select" value={ai.toneSetting}
                            onChange={e => ai.setToneSetting(e.target.value)}>
                            {['formal','casual','friendly'].map(t => (
                                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                            ))}
                        </select>
                        <Tile icon="🎭" label="Tone" color="pink" disabled={disabled}
                            onClick={ai.handleChangeTone} />
                    </div>
                    <div className="tu-tile-translate">
                        <select className="tu-translate-select" value={ai.translateLang}
                            onChange={e => ai.setTranslateLang(e.target.value)}>
                            {['Spanish','French','German','Hindi','Chinese','Japanese','Korean',
                              'Portuguese','Italian','Arabic','Russian','Dutch','Turkish','Bengali'].map(l => (
                                <option key={l} value={l}>{l}</option>
                            ))}
                        </select>
                        <Tile icon="🌐" label="Translate" color="pink" disabled={disabled}
                            onClick={ai.handleTranslate} />
                    </div>
                    <div className="tu-tile-translate">
                        <select className="tu-translate-select" value={ai.translitLang}
                            onChange={e => ai.setTranslitLang(e.target.value)}>
                            {['Hindi','Arabic','Chinese','Japanese','Korean','Russian',
                              'Greek','Thai','Bengali','Tamil','Telugu','Gujarati','Kannada','Urdu'].map(l => (
                                <option key={l} value={l}>{l}</option>
                            ))}
                        </select>
                        <Tile icon="अ" label="Translit" color="pink" disabled={disabled}
                            onClick={ai.handleTransliterate} />
                    </div>
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

            {/* Utilities */}
            <div className="tu-tile-section">
                <span className="tu-tile-sec-label" style={{ color: '#F59E0B' }}>◇ Utilities</span>
                <div className="tu-tile-row">
                    <Tile icon="📋" label="Templates" color="amber"
                        active={activePanel === 'templates'}
                        onClick={() => togglePanel('templates')} />
                    <Tile icon="↩" label="History" color="gray"
                        active={activePanel === 'history'}
                        onClick={() => togglePanel('history')} />
                    <Tile icon="W#" label="Word Freq" color="purple" disabled={disabled}
                        onClick={handleWordFrequency} />
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
        </div>
    )
}
