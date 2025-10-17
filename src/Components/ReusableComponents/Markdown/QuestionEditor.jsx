import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark as codeStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import './QuestionEditor.css';

const QuestionEditor = ({
    content,
    codeMode = true,
    latexMode = true,
    className = ""
}) => {
    // Custom code style based on vscDarkPlus
    const customCodeStyle = {
        ...codeStyle,
        'code[class*="language-"]': {
            ...codeStyle['code[class*="language-"]'],
            background: '#f0f0f0',
            color: '#424141',
            fontFamily: 'monospace',
            lineHeight:'1.8',
            fontSize: '14px',
            padding: '8px',
            borderRadius: '6px',
        },
        'pre[class*="language-"]': {
            ...codeStyle['pre[class*="language-"]'],
            background: '#f0f0f0',
            padding: '8px',
            borderRadius: '6px',
        },
    };

    const components = {
        // Code block rendering using your preferred syntax
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');

            if (!inline && match && codeMode) {
                const language = match[1].toUpperCase();
                return (
                    <div className="code-block-container">
                        {/* 👇 Language label */}
                        <div className="code-language-label">{language}</div>

                        <SyntaxHighlighter
                            style={customCodeStyle}
                            language={match[1]}
                            PreTag="div"
                            className="code-block"
                            showLineNumbers={false}
                        >
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    </div>
                );
            }

            return (
                <code className={`inline-code ${className || ''}`} {...props}>
                    {children}
                </code>
            );
        },

        // Image rendering
        img({ node, ...props }) {
            return (
                <img
                    src={props.src}
                    alt={props.alt || 'Image'}
                    className="markdown-image"
                    style={{ maxWidth: '15%', height: 'auto', display: 'block', margin: '10px 0' }}
                />
            );},

        // List rendering with proper styling
        ul({ node, children, ...props }) {
            return (
                <ul {...props} className="markdown-ul">
                    {children}
                </ul>
            );
        },

        ol({ node, children, ...props }) {
            return (
                <ol {...props} className="markdown-ol">
                    {children}
                </ol>
            );
        },

        li({ node, children, ...props }) {
            return (
                <li {...props} className="markdown-li">
                    {children}
                </li>
            );
        },

        // Table rendering
        table({ node, children, ...props }) {
            return (
                <div className="table-container">
                    <table className="markdown-table" {...props}>
                        {children}
                    </table>
                </div>
            );
        },

        th({ node, children, ...props }) {
            return (
                <th className="markdown-th" {...props}>
                    {children}
                </th>
            );
        },

        td({ node, children, ...props }) {
            return (
                <td className="markdown-td" {...props}>
                    {children}
                </td>
            );
        },

        // Paragraph rendering
        p({ node, children, ...props }) {
            return (
                <p className="markdown-p" style={{
                    marginBottom: '1em',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap'
                }} {...props}>
                    {children}
                </p>
            );
        },

        // Heading rendering
        h1({ node, children, ...props }) {
            return (
                <h1 className="markdown-h1" {...props}>
                    {children}
                </h1>
            );
        },

        h2({ node, children, ...props }) {
            return (
                <h2 className="markdown-h2" {...props}>
                    {children}
                </h2>
            );
        },

        h3({ node, children, ...props }) {
            return (
                <h3 className="markdown-h3" {...props}>
                    {children}
                </h3>
            );
        },

        h4({ node, children, ...props }) {
            return (
                <h4 className="markdown-h4" {...props}>
                    {children}
                </h4>
            );
        },

        h5({ node, children, ...props }) {
            return (
                <h5 className="markdown-h5" {...props}>
                    {children}
                </h5>
            );
        },

        h6({ node, children, ...props }) {
            return (
                <h6 className="markdown-h6" {...props}>
                    {children}
                </h6>
            );
        },

        // Blockquote rendering
        blockquote({ node, children, ...props }) {
            return (
                <blockquote className="markdown-blockquote" {...props}>
                    {children}
                </blockquote>
            );
        },

        // Link rendering
        a({ node, children, href, ...props }) {
            return (
                <a href={href} className="markdown-link" {...props} target="_blank" rel="noopener noreferrer">
                    {children}
                </a>
            );
        },

        // Horizontal rule
        hr({ node, ...props }) {
            return (
                <hr className="markdown-hr" {...props} />
            );
        }
    };

    const plugins = [];
    if (latexMode) {
        plugins.push(remarkMath);
    }

    const rehypePlugins = [rehypeRaw];
    if (latexMode) {
        rehypePlugins.push(rehypeKatex);
    }

    return (
        <div className={`question-editor-preview ${className}`}>
            <ReactMarkdown
                components={components}
                remarkPlugins={plugins}
                rehypePlugins={rehypePlugins}
                skipHtml={false}
            >
                {content || ''}
            </ReactMarkdown>
        </div>
    );
};

export default QuestionEditor;