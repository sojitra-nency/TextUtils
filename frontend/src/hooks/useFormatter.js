import { useState } from 'react'

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
    language:         'babel',
}

const parserImports = {
    babel:      () => import('prettier/parser-babel'),
    typescript: () => import('prettier/parser-typescript'),
    html:       () => import('prettier/parser-html'),
    css:        () => import('prettier/parser-postcss'),
}

const parserLabels = {
    babel:      'JS / JSX',
    typescript: 'TypeScript',
    html:       'HTML',
    css:        'CSS',
}

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

export default function useFormatter(text, setText, setLoading, showAlert) {
    const [fmtCfg, setFmtCfg] = useState(defaultFmtCfg)
    const [pendingFmtCfg, setPendingFmtCfg] = useState(defaultFmtCfg)

    const setPendingFmt = (patch) => setPendingFmtCfg(c => ({ ...c, ...patch }))

    const runFormat = async (parser, successMsg, cfgOverride) => {
        if (!text) return
        setLoading(true)
        const cfg = cfgOverride || fmtCfg
        try {
            const [prettierMod, parserMod] = await Promise.all([
                import('prettier/standalone'),
                parserImports[parser](),
            ])
            let code = text
            if (cfg.sortImports && ['babel', 'babel-ts', 'typescript'].includes(parser)) {
                code = sortImportsAlphabetically(code)
            }
            const formatted = prettierMod.default.format(code, {
                parser,
                plugins: [parserMod.default],
                tabWidth:       cfg.tabWidth,
                useTabs:        cfg.useTabs,
                semi:           cfg.semi,
                singleQuote:    cfg.singleQuote,
                trailingComma:  cfg.trailingComma,
                bracketSpacing: cfg.bracketSpacing,
                arrowParens:    cfg.arrowParens,
                jsxSingleQuote: cfg.jsxSingleQuote,
            })
            setText(formatted)
            showAlert(successMsg, 'success')
        } catch (err) {
            showAlert(err.message?.split('\n')[0] || 'Format error', 'danger')
        } finally {
            setLoading(false)
        }
    }

    const handleFormatHtml = () => runFormat('html',       'HTML formatted')
    const handleFormatCss  = () => runFormat('css',        'CSS formatted')
    const handleFormatJs   = () => runFormat('babel',      'JS / JSX formatted')
    const handleFormatTs   = () => runFormat('typescript', 'TypeScript formatted')

    const handleFmtApply = (setActivePanel) => {
        const cfg = pendingFmtCfg
        setFmtCfg(cfg)
        setActivePanel(null)
        const parser = cfg.language
        if (text && parserImports[parser]) {
            runFormat(parser, `${parserLabels[parser]} formatted with new settings`, cfg)
        } else {
            showAlert('Formatter settings applied', 'success')
        }
    }

    return {
        fmtCfg, setFmtCfg,
        pendingFmtCfg, setPendingFmtCfg,
        setPendingFmt,
        defaultFmtCfg,
        parserImports,
        parserLabels,
        handleFormatHtml, handleFormatCss, handleFormatJs, handleFormatTs,
        handleFmtApply,
    }
}
