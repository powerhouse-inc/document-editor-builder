
import type { EditorModule } from "document-model";
import { lazy } from "react";

/** Document editor module for the "["powerhouse/document-editor-builder"]" document type */
export const DocumentEditorBuilder: EditorModule = {
    Component: lazy(() => import("./editor.js")),
    documentTypes: ["powerhouse/document-editor-builder"],
    config: {
        id: "document-editor-builder",
        name: "Document Editor Builder",
    },
};
