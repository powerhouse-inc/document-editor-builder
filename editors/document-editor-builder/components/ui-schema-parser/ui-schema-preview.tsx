import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import type { Operation, PHBaseState, PHDocument } from "document-model";
import { useMemo } from "react";
import type {
  ActionComponentConfig,
  EditorComponent,
  GroupComponentConfig,
} from "../../../../document-models/document-editor-builder/index.js";
import { renderComponent } from "../../utils/component-renderer-utils.js";
import { GroupWrapper } from "./group-wrapper.js";

interface DocumentState extends PHBaseState {
  global: {
    [key: string]: string | number | boolean;
  };
}
interface UiSchemaPreviewProps {
  schema: Array<EditorComponent>;
  previewDocument?: PHDocument;
  previewDispatch?: DocumentDispatch<any>;
  showDevMode?: boolean;
  documentType?: string;
  groupProps?: GroupComponentConfig | null;
}

export function UiSchemaPreview({
  schema,
  previewDocument,
  previewDispatch,
  showDevMode,
  documentType,
  groupProps,
}: UiSchemaPreviewProps) {
  const componentsToRender = useMemo(() => {
    const mappedIds = schema.map((component) => component.id);
    return schema.filter(
      (component) =>
        (component.type === "action"
          ? !!(component.config as ActionComponentConfig)?.action?.id
          : true) &&
        (!component.groupId || !mappedIds.includes(component.groupId))
    );
  }, [schema]);

  return (
    <>
      <GroupWrapper
        groupProps={groupProps}
        usePaddingWrapper={true}
        paddingOnOuter={true}
        innerClassName="relative flex gap-4 w-full flex-1 transition-all duration-1000"
      >
        {componentsToRender.map((component) =>
          renderComponent({
            childComponent: component,
            editing: false,
            previewDocument,
            previewDispatch,
            documentType,
            groupId: component.id,
            schemaComponents: schema,
          })
        )}
        {componentsToRender.length === 0 && (
          <div className="text-sm text-gray-500">No components</div>
        )}
      </GroupWrapper>
      {showDevMode && (
        <div className="flex flex-col gap-2 p-2">
          <div className="text-lg">Document Preview -- DEV</div>
          <div className="text-sm text-(--secondary) whitespace-pre-wrap">
            <strong>Global State:</strong>
            <div>
              {(previewDocument?.state as DocumentState)?.global
                ? JSON.stringify(
                    (previewDocument?.state as DocumentState)?.global,
                    null,
                    2
                  )
                : "No global state"}
            </div>
            <strong className="block mt-2">Operations:</strong>
            <div>
              {(previewDocument?.operations.global &&
                previewDocument.operations.global.length) ||
              0 > 0 ? (
                <ul className="list-disc pl-5">
                  {previewDocument?.operations.global?.map(
                    (op: Operation, idx: number) => (
                      <li key={op.id ?? idx}>
                        <strong>{op.action.type} </strong>
                        <code>{JSON.stringify(op.action.input, null, 2)}</code>
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <span>No operations performed</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UiSchemaPreview;
