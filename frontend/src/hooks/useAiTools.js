import { useState } from 'react'
import * as textService from '../services/textService'

export default function useAiTools(text, setText, setLoading, setMarkdownMode, setPreviewMode, showAlert) {
    const [aiResult, setAiResult] = useState(null)
    const [toneSetting, setToneSetting] = useState('formal')
    const [formatSetting, setFormatSetting] = useState('paragraph')
    const [translateLang, setTranslateLang] = useState('Spanish')
    const [translitLang, setTranslitLang] = useState('Hindi')

    const hasMarkdown = (str) => /[|#*\-]{2,}|^\s*[•\-\d]+[.)]\s|^\|.+\|$/m.test(str)

    const callAi = async (serviceFn, label, errorMsg) => {
        if (!text) return
        setLoading(true)
        try {
            const data = await serviceFn(text)
            setAiResult({ label, result: data.result })
            setPreviewMode('result')
            showAlert(`${label} generated`, 'success')
        } catch (err) {
            showAlert(err.message || errorMsg, 'danger')
        } finally {
            setLoading(false)
        }
    }

    const handleHashtags         = () => callAi(textService.generateHashtags,         'Hashtags',          'Hashtag generation failed')
    const handleSeoTitles        = () => callAi(textService.generateSeoTitles,        'SEO Titles',        'SEO title generation failed')
    const handleMetaDescriptions = () => callAi(textService.generateMetaDescriptions, 'Meta Descriptions', 'Meta description generation failed')
    const handleBlogOutline      = () => callAi(textService.generateBlogOutline,      'Blog Outline',      'Blog outline generation failed')
    const handleTweetShorten     = () => callAi(textService.shortenForTweet,          'Tweet',             'Tweet shortening failed')
    const handleEmailRewrite     = () => callAi(textService.rewriteEmail,             'Email',             'Email rewriting failed')
    const handleKeywords         = () => callAi(textService.extractKeywords,          'Keywords',          'Keyword extraction failed')
    const handleSummarize        = () => callAi(textService.summarizeText,            'Summary',           'Summarization failed')
    const handleFixGrammar       = () => callAi(textService.fixGrammar,               'Grammar Fix',       'Grammar fixing failed')
    const handleParaphrase       = () => callAi(textService.paraphraseText,           'Paraphrase',        'Paraphrasing failed')
    const handleSentiment        = () => callAi(textService.analyzeSentiment,         'Sentiment',         'Sentiment analysis failed')
    const handleLengthenText     = () => callAi(textService.lengthenText,             'Lengthened',        'Text lengthening failed')

    const handleChangeFormat = async () => {
        if (!text) return
        setLoading(true)
        try {
            const data = await textService.changeFormat(text, formatSetting)
            setAiResult({ label: `Format (${formatSetting})`, result: data.result })
            setPreviewMode('result')
            showAlert(`Reformatted as ${formatSetting}`, 'success')
        } catch (err) {
            showAlert(err.message || 'Format changing failed', 'danger')
        } finally {
            setLoading(false)
        }
    }

    const handleChangeTone = async () => {
        if (!text) return
        setLoading(true)
        try {
            const data = await textService.changeTone(text, toneSetting)
            setAiResult({ label: `Tone (${toneSetting})`, result: data.result })
            setPreviewMode('result')
            showAlert(`Tone changed to ${toneSetting}`, 'success')
        } catch (err) {
            showAlert(err.message || 'Tone changing failed', 'danger')
        } finally {
            setLoading(false)
        }
    }

    const handleTranslate = async () => {
        if (!text) return
        setLoading(true)
        try {
            const data = await textService.translateText(text, translateLang)
            setAiResult({ label: `Translation (${translateLang})`, result: data.result })
            setPreviewMode('result')
            showAlert(`Translated to ${translateLang}`, 'success')
        } catch (err) {
            showAlert(err.message || 'Translation failed', 'danger')
        } finally {
            setLoading(false)
        }
    }

    const handleTransliterate = async () => {
        if (!text) return
        setLoading(true)
        try {
            const data = await textService.transliterateText(text, translitLang)
            setAiResult({ label: `Transliteration (${translitLang})`, result: data.result })
            setPreviewMode('result')
            showAlert(`Transliterated to ${translitLang} script`, 'success')
        } catch (err) {
            showAlert(err.message || 'Transliteration failed', 'danger')
        } finally {
            setLoading(false)
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
        handleChangeFormat, handleChangeTone, handleTranslate, handleTransliterate,
        handleAiAccept, handleAiDismiss,
    }
}
