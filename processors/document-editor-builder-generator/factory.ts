import {
  type ListenerFilter,
  type ProcessorRecord,
} from "document-drive";
import { DocumentEditorBuilderGeneratorProcessor } from "./index.js";

export const documentEditorBuilderGeneratorProcessorFactory =
  () =>
  async (): Promise<ProcessorRecord[]> => {
    // Create a filter for the processor
    const filter: ListenerFilter = {
      branch: ["main"],
      documentId: ["*"],
      documentType: ["powerhouse/document-editor-builder"],
      scope: ["global"],
    };

    // Create the processor
    const processor = new DocumentEditorBuilderGeneratorProcessor();
    return [
      {
        processor,
        filter,
      },
    ];
  };
