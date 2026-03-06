import React, { useState } from 'react'
import * as textService from '../services/textService'

export default function TextForm(props) {
    const [text, setText] = useState('Enter text here')
    const [loading, setLoading] = useState(false)
    const [summary, setSummary] = useState(null)

    // Generic handler for API-backed transformations
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

    const handleAnalyze = async () => {
        if (!text) return
        setLoading(true)
        try {
            const data = await textService.analyzeText(text)
            setSummary(data)
            props.showAlert('Text analyzed', 'success')
        } catch (err) {
            props.showAlert(err.message || 'API error', 'danger')
        } finally {
            setLoading(false)
        }
    }

    // Local operations — no backend needed
    const handleCtClick = () => {
        setText('')
        setSummary(null)
        props.showAlert('Text Cleared', 'success')
    }

    const handleCoClick = () => {
        navigator.clipboard.writeText(text)
        props.showAlert('Text Copied', 'success')
    }

    const handlePaClick = () => {
        navigator.clipboard.readText().then(t => setText(t))
        props.showAlert('Text Pasted', 'success')
    }

    const handleTtsClick = () => {
        const msg = new SpeechSynthesisUtterance(text)
        window.speechSynthesis.speak(msg)
        props.showAlert('Text-to-Speech', 'success')
    }

    const handleOnChange = (event) => {
        setText(event.target.value)
        setSummary(null)
    }

    const disabled = text.length === 0 || loading

    return (
        <>
            <div className='container'>
                <h1 className="my-3">{props.heading}</h1>
                <div className="mb-3">
                    <label htmlFor="text" className="form-label">Enter something into the box....</label>
                    <textarea
                        className="form-control"
                        id="text"
                        rows="10"
                        value={text}
                        onChange={handleOnChange}
                        style={{ backgroundColor: props.mode === 'dark' ? 'white' : '#E0E0E0' }}
                    />
                </div>

                <button disabled={disabled} className="btn btn-primary mx-1 my-1"
                    onClick={() => callApi(textService.toUpperCase, 'Converted to Uppercase')}>Upper Case</button>
                <button disabled={disabled} className="btn btn-primary mx-1 my-1"
                    onClick={() => callApi(textService.toLowerCase, 'Converted to Lowercase')}>Lower Case</button>
                <button disabled={disabled} className="btn btn-primary mx-1 my-1"
                    onClick={() => callApi(textService.toInverseCase, 'Converted to Inverse Case')}>Inverse Case</button>
                <button disabled={disabled} className="btn btn-primary mx-1 my-1"
                    onClick={() => callApi(textService.toUpperCamelCase, 'Converted to Upper Camel Case')}>Upper Camel Case</button>
                <button disabled={disabled} className="btn btn-primary mx-1 my-1"
                    onClick={() => callApi(textService.toLowerCamelCase, 'Converted to Lower Camel Case')}>Lower Camel Case</button>
                <button disabled={disabled} className="btn btn-primary mx-1 my-1"
                    onClick={() => callApi(textService.toSentenceCase, 'Converted to Sentence Case')}>Sentence Case</button>
                <button disabled={disabled} className="btn btn-primary mx-1 my-1"
                    onClick={() => callApi(textService.removeAllSpaces, 'Removed All Spaces')}>Remove All Spaces</button>
                <button disabled={disabled} className="btn btn-primary mx-1 my-1"
                    onClick={() => callApi(textService.removeExtraSpaces, 'Removed Extra Spaces')}>Remove Extra Spaces</button>
                <button disabled={disabled} className="btn btn-primary mx-1 my-1"
                    onClick={handleTtsClick}>Text to Speech</button>
                <button disabled={disabled} className="btn btn-primary mx-1 my-1"
                    onClick={handleCoClick}>Copy</button>
                <button disabled={loading} className="btn btn-primary mx-1 my-1"
                    onClick={handlePaClick}>Paste</button>
                <button disabled={text.length === 0} className="btn btn-primary mx-1 my-1"
                    onClick={handleCtClick}>Clear Text</button>
                <button disabled={disabled} className="btn btn-secondary mx-1 my-1"
                    onClick={handleAnalyze}>Analyze</button>

                {loading && <span className="ms-2 text-muted small">Processing...</span>}
            </div>

            <div className='container my-3'>
                <h2>Your Text Summary</h2>
                {summary ? (
                    <>
                        <p>{summary.sentence_count} sentences, {summary.word_count} words and {summary.character_count} characters</p>
                        <p>{summary.reading_time_minutes} minutes read.</p>
                    </>
                ) : (
                    <>
                        <p>
                            {text.split(/[.?]\s*(?=\s|$)|\n/).filter(e => e.length !== 0).length} sentences,&nbsp;
                            {text.split(/\s+/).filter(e => e.length !== 0).length} words and&nbsp;
                            {text.length} characters
                        </p>
                        <p>{(0.008 * text.split(' ').filter(e => e.length !== 0).length).toFixed(2)} minutes read.</p>
                    </>
                )}
                <h2>Preview</h2>
                <p>{text.length > 0 ? text : 'Nothing to Preview :('}</p>
            </div>
        </>
    )
}
