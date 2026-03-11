import React from 'react'

export default function WordFreqDrawer({
    wordFreq, freqSort, setFreqSort, handleWordFrequency, getSortedEntries, disabled,
}) {
    const entries = getSortedEntries()

    return (
        <div className="tu-find-inputs">
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button className="tu-btn tu-btn--tools" disabled={disabled}
                    onClick={handleWordFrequency}>Analyze</button>
                {wordFreq && (
                    <>
                        <span style={{ flex: 1 }} />
                        <span className="tu-find-count">{wordFreq.total} total</span>
                        <span className="tu-find-count">{wordFreq.unique} unique</span>
                        <select className="tu-translate-select" value={freqSort}
                            onChange={e => setFreqSort(e.target.value)}
                            style={{ fontSize: '0.72rem', padding: '0.15rem 0.4rem' }}>
                            <option value="count">By count</option>
                            <option value="alpha">A → Z</option>
                        </select>
                    </>
                )}
            </div>
            {entries.length > 0 && (
                <div className="tu-diff-output" style={{ maxHeight: 300, marginTop: '0.5rem' }}>
                    <div className="tu-diff-legend">
                        <span style={{ flex: 1, fontWeight: 700, fontSize: '0.72rem' }}>Word</span>
                        <span style={{ width: '3.5rem', textAlign: 'right', fontWeight: 700, fontSize: '0.72rem' }}>Count</span>
                        <span style={{ width: '3.5rem', textAlign: 'right', fontWeight: 700, fontSize: '0.72rem' }}>%</span>
                    </div>
                    {entries.map(([word, count], i) => (
                        <div key={i} className="tu-diff-line tu-diff-line--same"
                            style={{ padding: '0.25rem 0.9rem', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ flex: 1, fontSize: '0.78rem', fontFamily: "'JetBrains Mono', monospace" }}>
                                {word}
                            </span>
                            <span style={{ width: '3.5rem', textAlign: 'right', fontSize: '0.76rem', fontWeight: 600 }}>
                                {count}
                            </span>
                            <span style={{ width: '3.5rem', textAlign: 'right', fontSize: '0.72rem', color: 'var(--fg2)' }}>
                                {((count / wordFreq.total) * 100).toFixed(1)}%
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
