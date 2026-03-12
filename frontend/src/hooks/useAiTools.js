import { useState } from 'react'
import { useTransformTextMutation } from '../store/api/textApi'
import { ENDPOINTS } from '../constants/endpoints'

export default function useAiTools(text, setText, setMarkdownMode, setPreviewMode, showAlert, pushHistory) {
    const [aiResult, setAiResult] = useState(null)
    const [toneSetting, setToneSetting] = useState('formal')
    const [formatSetting, setFormatSetting] = useState('paragraph')
    const [translateLang, setTranslateLang] = useState('Spanish')
    const [translitLang, setTranslitLang] = useState('Hindi')

    const [transformText] = useTransformTextMutation()

    const hasMarkdown = (str) => /[|#*\-]{2,}|^\s*[•\-\d]+[.)]\s|^\|.+\|$/m.test(str)

    const callAi = async (endpoint, label, errorMsg) => {
        if (!text) return
        const original = text
        try {
            const data = await transformText({ endpoint, text }).unwrap()
            setAiResult({ label, result: data.result })
            setPreviewMode('result')
            if (pushHistory) pushHistory(label, original, data.result)
            showAlert(`${label} generated`, 'success')
        } catch (err) {
            showAlert(err.data?.detail || err.message || errorMsg, 'danger')
        }
    }

    const handleHashtags         = () => callAi(ENDPOINTS.GENERATE_HASHTAGS,         'Hashtags',          'Hashtag generation failed')
    const handleSeoTitles        = () => callAi(ENDPOINTS.GENERATE_SEO_TITLES,        'SEO Titles',        'SEO title generation failed')
    const handleMetaDescriptions = () => callAi(ENDPOINTS.GENERATE_META_DESCRIPTIONS, 'Meta Descriptions', 'Meta description generation failed')
    const handleBlogOutline      = () => callAi(ENDPOINTS.GENERATE_BLOG_OUTLINE,      'Blog Outline',      'Blog outline generation failed')
    const handleTweetShorten     = () => callAi(ENDPOINTS.SHORTEN_FOR_TWEET,          'Tweet',             'Tweet shortening failed')
    const handleEmailRewrite     = () => callAi(ENDPOINTS.REWRITE_EMAIL,              'Email',             'Email rewriting failed')
    const handleKeywords         = () => callAi(ENDPOINTS.EXTRACT_KEYWORDS,           'Keywords',          'Keyword extraction failed')
    const handleSummarize        = () => callAi(ENDPOINTS.SUMMARIZE,                  'Summary',           'Summarization failed')
    const handleFixGrammar       = () => callAi(ENDPOINTS.FIX_GRAMMAR,                'Grammar Fix',       'Grammar fixing failed')
    const handleParaphrase       = () => callAi(ENDPOINTS.PARAPHRASE,                 'Paraphrase',        'Paraphrasing failed')
    const handleSentiment        = () => callAi(ENDPOINTS.ANALYZE_SENTIMENT,          'Sentiment',         'Sentiment analysis failed')
    const handleLengthenText     = () => callAi(ENDPOINTS.LENGTHEN_TEXT,              'Lengthened',        'Text lengthening failed')
    const handleEli5             = () => callAi(ENDPOINTS.ELI5,                       'ELI5',              'ELI5 simplification failed')
    const handleProofread        = () => callAi(ENDPOINTS.PROOFREAD,                  'Proofread',         'Proofreading failed')
    const handleGenerateTitle    = () => callAi(ENDPOINTS.GENERATE_TITLE,             'Titles',            'Title generation failed')
    const handleRefactorPrompt   = () => callAi(ENDPOINTS.REFACTOR_PROMPT,            'Prompt Refactored', 'Prompt refactoring failed')

    const handleChangeFormat = async () => {
        if (!text) return
        const original = text
        try {
            const label = `Format (${formatSetting})`
            const data = await transformText({ endpoint: ENDPOINTS.CHANGE_FORMAT, text, format: formatSetting }).unwrap()
            setAiResult({ label, result: data.result })
            setPreviewMode('result')
            if (pushHistory) pushHistory(label, original, data.result)
            showAlert(`Reformatted as ${formatSetting}`, 'success')
        } catch (err) {
            showAlert(err.data?.detail || err.message || 'Format changing failed', 'danger')
        }
    }

    const handleChangeTone = async () => {
        if (!text) return
        const original = text
        try {
            const label = `Tone (${toneSetting})`
            const data = await transformText({ endpoint: ENDPOINTS.CHANGE_TONE, text, tone: toneSetting }).unwrap()
            setAiResult({ label, result: data.result })
            setPreviewMode('result')
            if (pushHistory) pushHistory(label, original, data.result)
            showAlert(`Tone changed to ${toneSetting}`, 'success')
        } catch (err) {
            showAlert(err.data?.detail || err.message || 'Tone changing failed', 'danger')
        }
    }

    const handleTranslate = async () => {
        if (!text) return
        const original = text
        try {
            const label = `Translation (${translateLang})`
            const data = await transformText({ endpoint: ENDPOINTS.TRANSLATE, text, target_language: translateLang }).unwrap()
            setAiResult({ label, result: data.result })
            setPreviewMode('result')
            if (pushHistory) pushHistory(label, original, data.result)
            showAlert(`Translated to ${translateLang}`, 'success')
        } catch (err) {
            showAlert(err.data?.detail || err.message || 'Translation failed', 'danger')
        }
    }

    const handleTransliterate = async () => {
        if (!text) return
        const original = text
        try {
            const label = `Transliteration (${translitLang})`
            const data = await transformText({ endpoint: ENDPOINTS.TRANSLITERATE, text, target_language: translitLang }).unwrap()
            setAiResult({ label, result: data.result })
            setPreviewMode('result')
            if (pushHistory) pushHistory(label, original, data.result)
            showAlert(`Transliterated to ${translitLang} script`, 'success')
        } catch (err) {
            showAlert(err.data?.detail || err.message || 'Transliteration failed', 'danger')
        }
    }

    const handleAiAccept = () => {
        if (aiResult) {
            setText(aiResult.result)
            if (hasMarkdown(aiResult.result)) setMarkdownMode(true)
            setAiResult(null)
        }
    }

    const handleAiDismiss = () => setAiResult(null)

    return {
        aiResult, setAiResult, hasMarkdown,
        toneSetting, setToneSetting,
        formatSetting, setFormatSetting,
        translateLang, setTranslateLang,
        translitLang, setTranslitLang,
        handleHashtags, handleSeoTitles, handleMetaDescriptions, handleBlogOutline,
        handleTweetShorten, handleEmailRewrite, handleKeywords,
        handleSummarize, handleFixGrammar, handleParaphrase,
        handleSentiment, handleLengthenText,
        handleEli5, handleProofread, handleGenerateTitle, handleRefactorPrompt,
        handleChangeFormat, handleChangeTone, handleTranslate, handleTransliterate,
        handleAiAccept, handleAiDismiss,
    }
}
