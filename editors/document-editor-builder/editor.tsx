import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import { useDocumentModelModuleById } from "@powerhousedao/reactor-browser";
import { type Action, type PHDocument } from "document-model";
import { useEffect, useState } from "react";
import { actions } from "@powerhousedao/document-editor-builder/document-models/document-editor-builder";
import { useSelectedDocumentEditorBuilderDocument } from "./hooks/useDocumentEditorBuilderDocument.js";
import ChooseDocumentPage from "./pages/choose-document-page.js";
import PreviewPage from "./pages/preview-page.js";
import { Toaster } from "./components/ui/sonner.js";

export default function Editor() {
  const [documentEditor, dispatch] = useSelectedDocumentEditorBuilderDocument();

  const [documentTypeSelected, setDocumentTypeSelected] = useState<boolean>(
    !!documentEditor.state.global.documentType
  );

  const selectedModule = useDocumentModelModuleById(
    documentEditor.state.global.documentType
      ? documentEditor.state.global.documentType
      : undefined
  );

  const [previewDocument, setPreviewDocument] = useState<PHDocument>();
  const previewDispatch = previewDocument
    ? (((action: Action) => {
        setPreviewDocument((document) => {
          return document
            ? selectedModule?.reducer(document, action)
            : document;
        });
      }) as DocumentDispatch<any>)
    : undefined;

  useEffect(() => {
    if (documentTypeSelected) {
      const createdDocument =
        selectedModule?.utils?.createDocument?.() as PHDocument;

      setPreviewDocument(createdDocument);
    }
  }, [documentTypeSelected]);

  const handleConfirmDocumentType = (
    documentType: string,
    documentName: string
  ) => {
    dispatch(
      actions.setDocumentType({
        documentType: documentType,
        documentName: documentName,
      })
    );
    setDocumentTypeSelected(true);
  };

  const handleResetDocumentType = () => {
    setDocumentTypeSelected(false);
    setPreviewDocument(undefined);
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        {/* <EditDocumentEditorBuilderName /> */}
        {/* <DocumentToolbar document={documentEditor} onClose={handleClose} /> */}
        {!documentTypeSelected ? (
          <ChooseDocumentPage onConfirm={handleConfirmDocumentType} />
        ) : (
          <PreviewPage
            previewDocument={previewDocument}
            previewDispatch={previewDispatch}
            onResetDocumentType={handleResetDocumentType}
          />
        )}
      </div>
      <Toaster />
    </>
  );
}
