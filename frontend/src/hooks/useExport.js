export default function useExport(text, setLoading, showAlert) {
    const triggerDownload = (blob, filename) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleDownloadTxt = () => {
        triggerDownload(new Blob([text], { type: 'text/plain' }), 'fixmytext.txt')
        showAlert('Downloaded as TXT', 'success')
    }

    const handleDownloadJson = () => {
        triggerDownload(
            new Blob([JSON.stringify({ text }, null, 2)], { type: 'application/json' }),
            'fixmytext.json'
        )
        showAlert('Downloaded as JSON', 'success')
    }

    const handleDownloadPdf = async () => {
        setLoading(true)
        try {
            const { jsPDF } = await import('jspdf')
            const doc = new jsPDF()
            const lines = doc.splitTextToSize(text, 180)
            doc.text(lines, 14, 20)
            doc.save('fixmytext.pdf')
            showAlert('Downloaded as PDF', 'success')
        } catch (err) {
            showAlert('PDF export failed', 'danger')
        } finally {
            setLoading(false)
        }
    }

    const handleDownloadDocx = async () => {
        setLoading(true)
        try {
            const { Document, Paragraph, TextRun, Packer } = await import('docx')
            const paragraphs = text.split('\n').map(line =>
                new Paragraph({ children: [new TextRun(line)] })
            )
            const wordDoc = new Document({ sections: [{ properties: {}, children: paragraphs }] })
            const blob = await Packer.toBlob(wordDoc)
            triggerDownload(blob, 'fixmytext.docx')
            showAlert('Downloaded as DOCX', 'success')
        } catch (err) {
            showAlert('DOCX export failed', 'danger')
        } finally {
            setLoading(false)
        }
    }

    return {
        handleDownloadTxt, handleDownloadJson, handleDownloadPdf, handleDownloadDocx,
    }
}
