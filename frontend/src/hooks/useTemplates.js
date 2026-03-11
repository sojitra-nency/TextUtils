import { useState, useEffect } from 'react'

const STORAGE_KEY = 'tu-templates'

function loadTemplates() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : []
    } catch { return [] }
}

function saveTemplates(templates) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
}

export default function useTemplates(text, setText, showAlert) {
    const [templates, setTemplates] = useState(loadTemplates)
    const [templateName, setTemplateName] = useState('')

    useEffect(() => { saveTemplates(templates) }, [templates])

    const handleSaveTemplate = () => {
        const name = templateName.trim()
        if (!name) { showAlert('Enter a template name', 'danger'); return }
        if (!text) { showAlert('Nothing to save', 'danger'); return }
        const exists = templates.findIndex(t => t.name === name)
        if (exists >= 0) {
            setTemplates(prev => prev.map((t, i) => i === exists ? { ...t, text, updatedAt: Date.now() } : t))
            showAlert(`Template "${name}" updated`, 'success')
        } else {
            setTemplates(prev => [...prev, { name, text, createdAt: Date.now(), updatedAt: Date.now() }])
            showAlert(`Template "${name}" saved`, 'success')
        }
        setTemplateName('')
    }

    const handleLoadTemplate = (idx) => {
        setText(templates[idx].text)
        showAlert(`Template "${templates[idx].name}" loaded`, 'success')
    }

    const handleDeleteTemplate = (idx) => {
        const name = templates[idx].name
        setTemplates(prev => prev.filter((_, i) => i !== idx))
        showAlert(`Template "${name}" deleted`, 'success')
    }

    return {
        templates, templateName, setTemplateName,
        handleSaveTemplate, handleLoadTemplate, handleDeleteTemplate,
    }
}
