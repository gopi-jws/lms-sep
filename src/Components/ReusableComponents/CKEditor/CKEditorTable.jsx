import React, { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./CKEditorTable.css"

export default function CKEditorTable({
    value = "",
    onChange,
    placeholder = ""
}) {
    const [editorData, setEditorData] = useState(value);

    // Update internal state when value prop changes
    useEffect(() => {
        setEditorData(value);
    }, [value]);

    const handleEditorChange = (event, editor) => {
         
        const data = editor.getData();

        setEditorData(data);

        // Call parent's onChange callback if provided
        if (onChange) {
            onChange(data);
        }

        // console.log("Editor data:", data);
    };

    return (
        <div style={{ width: "100%", minHeight: "100px" }}>
            <div>
                <CKEditor
                    editor={ClassicEditor}
                    data={editorData}
                    onChange={handleEditorChange}
                    config={{
                        toolbar: {
                            items: [
                                "heading",
                                "|",
                                "bold",
                                "italic",
                                "underline",
                                "link",
                                "|",
                                "bulletedList",
                                "numberedList",
                                "outdent",
                                "indent",
                                "|",
                                "insertTable",
                                "tableColumn",
                                "tableRow",
                                "mergeTableCells",
                                "|",
                                "undo",
                                "redo",
                            ],
                        },
                        table: {
                            contentToolbar: [
                                "tableColumn",
                                "tableRow",
                                "mergeTableCells",
                                "tableCellProperties",
                                "tableProperties",
                            ],
                        },
                        list: {
                            properties: {
                                styles: true,
                                startIndex: true,
                                reversed: true,
                            },
                        },
                        placeholder: placeholder,
                    }}
                />
            </div>
        </div>
    );
}