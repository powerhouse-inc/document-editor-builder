import type { EditorComponent } from "../../index.js";
import type { DocumentEditorBuilderSchemaOperations } from "@powerhousedao/document-editor-builder/document-models/document-editor-builder";

export const documentEditorBuilderSchemaOperations: DocumentEditorBuilderSchemaOperations =
  {
    setSchemaOperation(state, action) {
      // TODO improve types on specification
      state.schema = action.input.schema as Array<EditorComponent>;
    },
    resetSchemaOperation(state) {
      state.schema = [];
    },
  };
