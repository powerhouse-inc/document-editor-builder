import { Button } from "@powerhousedao/document-engineering";
import {
  actions,
  type EditorComponent,
  type GroupComponentConfig,
  type Theme,
} from "../../../../document-models/document-editor-builder/index.js";
import { JsonTreeViewer } from "../../utils/json-tree-viewer.js";
import { useSelectedDocumentEditorBuilderDocument } from "../../hooks/useDocumentEditorBuilderDocument.js";
import { GroupWrapper } from "./group-wrapper.js";
import { useMemo } from "react";

interface UiSchemaJsonViewerProps {
  data: {
    schema: Array<EditorComponent>;
    theme: Theme;
    groupProps: GroupComponentConfig | null;
  };
}

export function UiSchemaJsonViewer({ data }: UiSchemaJsonViewerProps) {
  const [documentEditor, dispatch] = useSelectedDocumentEditorBuilderDocument();

  const groupProps = useMemo(() => {
    return documentEditor?.state.global.groupProps as
      | GroupComponentConfig
      | null
      | undefined;
  }, [documentEditor?.state.global.groupProps]);

  return (
    <GroupWrapper
      groupProps={groupProps}
      usePaddingWrapper={true}
      paddingOnOuter={true}
      innerClassName="relative flex flex-col gap-4 w-full flex-1 transition-all duration-1000"
    >
      <div className="flex flex-col gap-4 w-full">
        <JsonTreeViewer data={data} />
        <div className="flex justify-end">
          <Button
            variant="destructive"
            onClick={() => {
              dispatch(
                actions.setSchema({
                  schema: [],
                })
              );
            }}
          >
            Reset Schema
          </Button>
        </div>
      </div>
    </GroupWrapper>
  );
}

export default UiSchemaJsonViewer;
