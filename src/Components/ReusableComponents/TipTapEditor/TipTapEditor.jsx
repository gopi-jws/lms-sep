import { useEditor, EditorContent } from '@tiptap/react'
import './TipTapEditor.css' // Make sure this path is correct
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Underline } from "@tiptap/extension-underline";
import { CodeBlock } from "@tiptap/extension-code-block";
import { Code } from "@tiptap/extension-code";
import { TextAlign } from '@tiptap/extension-text-align';

import {
    FaBold,
    FaItalic,
    FaListUl,
    FaListOl,
    FaTable,
    FaImage,
    FaUndo,
    FaRedo,
    FaCode,
    FaAlignLeft,
    FaAlignCenter,
    FaAlignRight
} from 'react-icons/fa'
import { BiMath } from 'react-icons/bi'

const TipTapEditor = ({ value, onChange, placeholder = "Enter text..." }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                HTMLAttributes: {
                    class: 'editor-image',
                },
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'editor-table',
                },
            }),
            TableRow,
            TableHeader,
            TableCell,
            Underline,
            CodeBlock.configure({
                HTMLAttributes: {
                    class: 'code-block',
                },
            }),
            Code.configure({
                HTMLAttributes: {
                    class: 'inline-code',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4',
                placeholder: placeholder,
            },
        },
    })

    if (!editor) {
        return <div className="p-4 text-gray-500">Loading editor...</div>
    }

    return (
        <div className="tiptap-editor">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}

const MenuBar = ({ editor }) => {
    if (!editor) return null

    const addImage = () => {
        const url = window.prompt('Enter image URL:')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    const addCodeBlock = () => {
        editor.chain().focus().setCodeBlock().run()
    }

    const addInlineCode = () => {
        editor.chain().focus().toggleCode().run()
    }

    const addMathEquation = () => {
        const equation = window.prompt('Enter LaTeX equation (will be wrapped in $...$):')
        if (equation) {
            editor.chain().focus().insertContent(`$${equation}$`).run()
        }
    }

    const addBlockMathEquation = () => {
        const equation = window.prompt('Enter LaTeX equation (will be wrapped in $$...$$):')
        if (equation) {
            editor.chain().focus().insertContent(`\n\n$$${equation}$$\n\n`).run()
        }
    }

    return (
        <div className="menu-bar">
            {/* Text Formatting */}
            <div className="toolbar-group">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`toolbar-btn ${editor.isActive('bold') ? 'is-active' : ''}`}
                    title="Bold"
                >
                    <FaBold size={14} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`toolbar-btn ${editor.isActive('italic') ? 'is-active' : ''}`}
                    title="Italic"
                >
                    <FaItalic size={14} />
                </button>
                <button
                    onClick={addInlineCode}
                    className={`toolbar-btn ${editor.isActive('code') ? 'is-active' : ''}`}
                    title="Inline Code"
                >
                    <FaCode size={14} />
                </button>
            </div>

            {/* Lists */}
            <div className="toolbar-group">
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`toolbar-btn ${editor.isActive('bulletList') ? 'is-active' : ''}`}
                    title="Bullet List"
                >
                    <FaListUl size={14} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`toolbar-btn ${editor.isActive('orderedList') ? 'is-active' : ''}`}
                    title="Numbered List"
                >
                    <FaListOl size={14} />
                </button>
            </div>

            {/* Code & Math */}
            <div className="toolbar-group">
                <button
                    onClick={addCodeBlock}
                    className={`toolbar-btn ${editor.isActive('codeBlock') ? 'is-active' : ''}`}
                    title="Code Block"
                >
                    <FaCode size={14} />
                </button>
                <button
                    onClick={addMathEquation}
                    className="toolbar-btn"
                    title="Inline Math ($...$)"
                >
                    <BiMath size={16} />
                </button>
                <button
                    onClick={addBlockMathEquation}
                    className="toolbar-btn"
                    title="Block Math ($$...$$)"
                >
                    <BiMath size={18} />
                </button>
            </div>

            {/* Tables & Images */}
            <div className="toolbar-group">
                <button
                    onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                    className="toolbar-btn"
                    title="Insert Table"
                >
                    <FaTable size={14} />
                </button>
                <button
                    onClick={addImage}
                    className="toolbar-btn"
                    title="Insert Image"
                >
                    <FaImage size={14} />
                </button>
            </div>

            {/* Text Alignment */}
            <div className="toolbar-group">
                <button
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`toolbar-btn ${editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}`}
                    title="Align Left"
                >
                    <FaAlignLeft size={14} />
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`toolbar-btn ${editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}`}
                    title="Align Center"
                >
                    <FaAlignCenter size={14} />
                </button>
                <button
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`toolbar-btn ${editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}`}
                    title="Align Right"
                >
                    <FaAlignRight size={14} />
                </button>
            </div>

            {/* Undo/Redo */}
            <div className="toolbar-group">
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    className="toolbar-btn"
                    title="Undo"
                >
                    <FaUndo size={14} />
                </button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    className="toolbar-btn"
                    title="Redo"
                >
                    <FaRedo size={14} />
                </button>
            </div>
        </div>
    )
}

export default TipTapEditor