import { Button, Checkbox } from "@powerhousedao/document-engineering";
import { confirm } from "@powerhousedao/document-engineering/ui";
import { CircleMinusIcon, PencilIcon } from "lucide-react";
import { useMemo } from "react";
import {
  actions,
  type ActionComponentConfig,
  type EditorComponent,
  type InputComponentConfig,
} from "../../../../document-models/document-editor-builder/index.js";
import { useSchemaEditor } from "../../context/SchemaEditorContext.js";
import { useSelectedDocumentEditorBuilderDocument } from "../../hooks/useDocumentEditorBuilderDocument.js";
import { getDefaultCallbackTriggerForDataType } from "../../utils/ui-schema-utils.js";
import { Separator } from "../ui/separator.js";
import { ComponentSettingsHeader } from "./ComponentSettingsHeader.js";
import GroupPropsSection from "./GroupPropsSection.js";

export function ActionSettingsContent({
  component,
  onClose,
}: {
  component: EditorComponent;
  onClose: () => void;
}) {
  const [documentEditor, dispatch] = useSelectedDocumentEditorBuilderDocument();
  const { setEditComponent } = useSchemaEditor();

  const fields = useMemo(() => {
    return documentEditor.state.global.schema.filter(
      (c) => c.groupId === component.id && c.type === "input"
    );
  }, [documentEditor.state.global.schema, component.id]);

  const handleTriggerChange = (checked: boolean) => {
    if (!component) return;

    dispatch(
      actions.editActionComponent({
        id: component.id,
        trigger: checked
          ? "onSubmit"
          : fields.length > 1
            ? "onBlur"
            : getDefaultCallbackTriggerForDataType(
                (fields?.[0]?.config as InputComponentConfig)?.field?.dataType
              ),
      })
    );
  };

  const handleResetButtonCheckboxChange = (checked: boolean) => {
    if (!component) return;

    dispatch(
      actions.editActionComponent({
        id: component.id,
        hasResetButton: checked,
      })
    );
  };

  return (
    <div className="flex flex-col w-full min-w-[315px] gap-4">
      <ComponentSettingsHeader
        componentId={component.id}
        title={
          (component.config as ActionComponentConfig)?.action?.name ||
          "Action Widget"
        }
        onClose={onClose}
      />

      <div className=" px-3 pb-4 flex-1 overflow-auto space-y-4">
        <GroupPropsSection component={component} />
        <Separator className="bg-gray-200" />
        <div>
          <Checkbox
            value={
              (component.config as ActionComponentConfig)?.formProps
                ?.trigger === "onSubmit"
            }
            onChange={handleTriggerChange}
            label="Use submit button"
            disabled={
              (component.config as ActionComponentConfig)?.formProps
                ?.trigger === "onSubmit" && fields?.length === 0
            }
          />
        </div>
        <div>
          <Checkbox
            value={
              (component.config as ActionComponentConfig)?.formProps
                ?.hasResetButton ?? false
            }
            onChange={handleResetButtonCheckboxChange}
            label="Use Reset Form button"
          />
        </div>
        <Separator className="bg-gray-200" />
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="flex-1 "
            onClick={() => setEditComponent(component.id)}
          >
            <span className="text-sm font-medium">Edit Action</span>

            <PencilIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="text-red-800 border-red-800 hover:text-red-900"
            onClick={async () => {
              const ok = await confirm({
                title: "Remove component?",
                description: "This will delete the component from the preview.",
                confirmLabel: "Remove",
                cancelLabel: "Cancel",
              });
              if (ok) {
                dispatch(
                  actions.removeComponent({ componentId: component.id })
                );
              }
            }}
          >
            <span className="text-sm font-medium">Remove</span>
            <CircleMinusIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ActionSettingsContent;
