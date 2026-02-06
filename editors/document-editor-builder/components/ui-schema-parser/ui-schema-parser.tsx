import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import { dispatchActions } from "@powerhousedao/reactor-browser";
import { actions, type PHDocument } from "document-model";
import {
  BookOpenText,
  Braces,
  Eye,
  Redo2Icon,
  Settings2,
  Undo2Icon,
} from "lucide-react";
import { useState } from "react";
import type { EditorComponent } from "../../../../document-models/document-editor-builder/index.js";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs.js";
import { useSchemaEditor } from "../../context/SchemaEditorContext.js";
import { useSelectedDocumentEditorBuilderDocument } from "../../hooks/useDocumentEditorBuilderDocument.js";
import ThemeSettingsContent from "../component-settings/ThemeSettingsContent.js";
import { ButtonDiv } from "../ui/button-div.js";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover.js";
import { UiSchemaEditor } from "./ui-schema-editor.js";
import { UiSchemaJsonViewer } from "./ui-schema-json-viewer.js";
import { UiSchemaPreview } from "./ui-schema-preview.js";
import { Button } from "@powerhousedao/document-engineering";

interface UiSchemaParserProps {
  schema: Array<EditorComponent>;
  previewDocument?: PHDocument;
  previewDispatch?: DocumentDispatch<any>;
  editing?: boolean;
}

export function UiSchemaParser({
  schema,
  previewDocument,
  previewDispatch,
}: UiSchemaParserProps) {
  const [documentEditor, dispatch] = useSelectedDocumentEditorBuilderDocument();

  const [activeTab, setActiveTab] = useState<"editor" | "preview" | "uischema">(
    "editor"
  );
  const { clearEdit } = useSchemaEditor();

  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="relative flex flex-1 h-full max-h-full overflow-auto border border-gray-200 rounded-md bg-white pt-1">
      <Tabs
        value={activeTab}
        onValueChange={(v: string) => {
          setActiveTab(v as "editor" | "preview" | "uischema");
          clearEdit();
        }}
        className="flex-1"
        variant="underline"
      >
        <div className="flex justify-between items-center border-b border-gray-200 mx-4">
          <TabsList>
            <TabsTrigger value="editor">
              <div className="flex items-center gap-1">
                <BookOpenText className="w-4 h-4" />
                <span className="text-sm font-medium">Builder</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="preview">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Preview</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="uischema">
              <div className="flex items-center gap-1">
                <Braces className="w-4 h-4" />
                <span className="text-sm font-medium">UI Schema</span>
              </div>
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 p-0 border border-gray-300"
              onClick={() => {
                void dispatchActions(
                  actions.undo() as any,
                  documentEditor as any
                );
              }}
            >
              <Undo2Icon className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 p-0
              border border-gray-300"
              onClick={() => {
                void dispatchActions(
                  actions.redo() as any,
                  documentEditor as any
                );
              }}
            >
              <Redo2Icon className="w-4 h-4" />
            </Button>

            <Popover
              open={openMenu}
              onOpenChange={(v) => {
                // allow onBlur to run on settings fields
                setTimeout(() => setOpenMenu(v), v ? 0 : 10);
              }}
            >
              <PopoverTrigger asChild>
                <ButtonDiv
                  size="icon"
                  variant="ghost"
                  className="border border-gray-300"
                >
                  <Settings2 className="w-4 h-4" />
                </ButtonDiv>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="p-0 bg-[#F9F9F9] border border-gray-200 shadow-lg w-[360px] max-w-[90vw]"
              >
                <ThemeSettingsContent onClose={() => setOpenMenu(false)} />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex-1 overflow-auto h-full bg-(--background) text-(--foreground)">
          <TabsContent value="editor" className="pt-0 overflow-auto r">
            <UiSchemaEditor
              schema={schema}
              previewDocument={previewDocument}
              previewDispatch={previewDispatch}
            />
          </TabsContent>
          <TabsContent value="preview" className="pt-0 overflow-auto">
            <UiSchemaPreview
              documentType={documentEditor.state.global.documentType ?? ""}
              schema={schema}
              previewDocument={previewDocument}
              previewDispatch={previewDispatch}
              showDevMode={false}
              groupProps={documentEditor.state.global.groupProps ?? null}
            />
          </TabsContent>
          <TabsContent value="uischema">
            <UiSchemaJsonViewer
              data={{
                schema,
                theme: documentEditor.state.global.theme ?? {
                  backgroundColor: "#FFFFFF00",
                  primaryColor: "#000000",
                  secondaryTextColor: "#6B7280",
                  textColor: "#111827",
                },
                groupProps: documentEditor.state.global.groupProps ?? null,
              }}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default UiSchemaParser;
