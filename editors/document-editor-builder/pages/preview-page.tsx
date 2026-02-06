import type { PHDocument } from "document-model";
import { useSelectedDocumentEditorBuilderDocument } from "../hooks/useDocumentEditorBuilderDocument.js";
import MainSidebar from "../components/main-sidebar/MainSidebar.js";
import { UiSchemaParser } from "../components/ui-schema-parser/ui-schema-parser.js";
import { SchemaEditorProvider } from "../context/SchemaEditorContext.js";
import AddToPreviewDialog from "../components/main-sidebar/AddToPreviewDialog.js";
import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import { useMemo } from "react";
import { PencilIcon } from "lucide-react";
import { Button } from "@powerhousedao/document-engineering";
import { ThemeConfigurator } from "../components/ThemeConfigurator.js";

interface IProps {
  previewDocument?: PHDocument;
  previewDispatch?: DocumentDispatch<any>;
  onResetDocumentType: () => void;
}
export default function PreviewPage({
  previewDocument,
  previewDispatch,
  onResetDocumentType,
}: IProps) {
  const [documentEditor] = useSelectedDocumentEditorBuilderDocument();
  const documentTypeId = useMemo(() => {
    return documentEditor.state.global.documentType;
  }, [documentEditor]);

  return (
    <>
      <ThemeConfigurator
        theme={
          documentEditor?.state.global.theme ?? {
            backgroundColor: "#FFFFFF00",
            primaryColor: "#000000",
            secondaryTextColor: "#6B7280",
            textColor: "#111827",
          }
        }
      />
      <SchemaEditorProvider>
        <div className="flex flex-col gap-6 py-4 px-6 xl:py-8 xl:px-12 h-full">
          <div className="flex gap-4 items-center">
            <div className="flex flex-col">
              <span className="text-2xl font-semibold">
                {documentEditor.state.global.documentName || "—-"}
              </span>
              {documentTypeId && (
                <div className="text-[10px] text-gray-500 truncate">
                  {documentTypeId}
                </div>
              )}
            </div>
            <Button
              size="icon"
              variant="outline"
              className="w-6 h-6 border-gray-300 "
              onClick={onResetDocumentType}
            >
              <PencilIcon />
            </Button>
          </div>
          <div className="flex w-full gap-8 flex-1 overflow-auto">
            <MainSidebar />
            <div className="flex-1">
              <UiSchemaParser
                schema={documentEditor.state.global.schema}
                previewDocument={previewDocument}
                previewDispatch={previewDispatch}
              />
            </div>
          </div>
        </div>

        <AddToPreviewDialog />
      </SchemaEditorProvider>
    </>
  );
}
