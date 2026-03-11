import { useState, useRef } from 'react'

export default function useSpeech(text, setText, showAlert) {
    const [listening, setListening] = useState(false)
    const recognitionRef = useRef(null)

    const handleTts = () => {
        const msg = new SpeechSynthesisUtterance(text)
        window.speechSynthesis.speak(msg)
        showAlert('Speaking\u2026', 'info')
    }

    const handleSpeechToText = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognition) {
            showAlert('Speech recognition not supported in this browser', 'danger')
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
            showAlert('Speech recognition error', 'danger')
        }
        recognition.onend = () => setListening(false)
        recognitionRef.current = recognition
        recognition.start()
        setListening(true)
        showAlert('Listening\u2026 speak now', 'info')
    }

    return { listening, handleTts, handleSpeechToText }
}
