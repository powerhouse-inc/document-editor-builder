import type { DocumentEditorBuilderDocumentTypeOperations } from "@powerhousedao/document-editor-builder/document-models/document-editor-builder";

export const documentEditorBuilderDocumentTypeOperations: DocumentEditorBuilderDocumentTypeOperations =
  {
    setDocumentTypeOperation(state, action) {
      if (action.input.documentType === null) {
        state.schema = [];
        state.documentName = "";
      } else {
        if (state.documentType !== action.input.documentType) {
          state.schema = [];
        }

        state.documentName = action.input.documentName ?? "";
      }

      state.documentType = action.input.documentType || null;
    },
    setNewDocumentNameOperation(state, action) {
      state.documentName = action.input.name;
    },
  };
