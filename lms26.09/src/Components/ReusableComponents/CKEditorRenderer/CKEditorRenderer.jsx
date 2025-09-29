import React, { useEffect } from "react"
import '../CKEditorRenderer/CKEditorRenderer.css'
import DOMPurify from "dompurify"
import Prism from "prismjs"

const CKEditorRenderer = ({ content, mode}) => {

    if (!content) return <div className="placeholder-text">Content will appear here</div>
    console.log(mode);
    console.log(content);
    

    useEffect(() => {
        // Render math via MathJax
        if (window.MathJax) {
            window.MathJax.typesetPromise()
        }

        // Highlight code
        Prism.highlightAll()
    }, [content])

    // Configure allowed tags & attributes based on mode
    let allowedTags = []
    let allowedAttrs = [
        "src", "alt", "title", "width", "height", "style", "class", "id",
        "href", "target", "rel", "xmlns", "display", "mathvariant"
    ]

    if (mode === "code") {
        allowedTags = ["pre", "code"]
    } else if (mode === "latex") {
        allowedTags = ["math", "semantics", "mrow", "mi", "mo", "mn"]
    } else if (mode === "both") {
        allowedTags = [
            "p", "br", "strong", "em", "u", "i", "b", "span", "div",
            "img", "a", "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6",
            "blockquote", "code", "pre",
            "math", "semantics", "mrow", "mi", "mo", "mn"
        ]
    }

    const purifyConfig = {
        ALLOWED_TAGS: allowedTags,
        ALLOWED_ATTR: allowedAttrs,
        ALLOW_DATA_ATTR: true
    }

    const cleanHTML = DOMPurify.sanitize(content, purifyConfig)

    return (
        <div
            className="rendered-content"
            dangerouslySetInnerHTML={{ __html: cleanHTML }}
        />
    )
}

export default React.memo(CKEditorRenderer)
