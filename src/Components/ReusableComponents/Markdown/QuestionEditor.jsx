import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'   // 👈 import this
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark as codeStyle } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function QuestionEditor({ content, mode }) {
    if (!content) return <div className="placeholder-text">Content will appear here</div>

    const [question, setQuestion] = useState("")

    useEffect(() => {
        if (content) {
            let value = content.replace(/\r\n|\r|\n/g, '\n')

            if (mode === 'latex') {
                value = value.replace(/~~~[\s\S]*?~~~/g, '') // remove code blocks
            }

            if (mode === 'code') {
                value = value.replace(/\$\$[\s\S]*?\$\$/g, '') // remove display math
                value = value.replace(/\$[^$\n]+\$/g, '')      // remove inline math
            }

            setQuestion(value)
        }
    }, [content, mode])

    const customCodeStyle = {
        ...codeStyle,
        'code[class*="language-"]': {
            ...codeStyle['code[class*="language-"]'],
            background: '#f0f0f0',
            color: '#424141',
            fontFamily: 'monospace',
            fontSize: '14px',
            padding: '8px',
            borderRadius: '6px',
        },
        'pre[class*="language-"]': {
            ...codeStyle['pre[class*="language-"]'],
            background: '#f0f0f0',
            padding: '8px',
            borderRadius: '6px',
        }
    }

    const components = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
                <SyntaxHighlighter
                    style={customCodeStyle}
                    language={match[1]}
                    PreTag="div"
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            )
        }
    }

    const remark = []
    const rehype = [rehypeRaw]   // 👈 allow raw HTML like <img>, <sup>, etc.

    if (mode === 'latex' || mode === 'both') {
        remark.push(remarkMath)
        rehype.push(rehypeKatex)
    }

    return (
        <ReactMarkdown
            components={components}
            remarkPlugins={remark}
            rehypePlugins={rehype}
        >
            {question}
        </ReactMarkdown>
    )
}
