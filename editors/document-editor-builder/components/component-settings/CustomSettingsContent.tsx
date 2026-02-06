import {
  Button,
  TextInput,
  confirm,
} from "@powerhousedao/document-engineering";
import {
  actions,
  type CustomComponentConfig,
  type EditorComponent,
} from "../../../../document-models/document-editor-builder/index.js";
import { useSelectedDocumentEditorBuilderDocument } from "../../hooks/useDocumentEditorBuilderDocument.js";

import { useEffect, useState } from "react";
import { ComponentSettingsHeader } from "./ComponentSettingsHeader.js";
import { CircleMinusIcon } from "lucide-react";
import { Separator } from "../ui/separator.js";

export function CustomSettingsContent({
  component,
  onClose,
}: {
  component: EditorComponent;
  onClose: () => void;
}) {
  const [_, dispatch] = useSelectedDocumentEditorBuilderDocument();
  const [name, setName] = useState(
    (component?.config as CustomComponentConfig)?.name ?? ""
  );
  const [path, setPath] = useState(
    (component?.config as CustomComponentConfig)?.path ?? ""
  );

  useEffect(() => {
    setName((component?.config as CustomComponentConfig)?.name ?? "");
    setPath((component?.config as CustomComponentConfig)?.path ?? "");
  }, [component]);

  const handleNameBlur = () => {
    if (
      !component ||
      name === (component.config as CustomComponentConfig)?.name
    )
      return;
    dispatch(
      actions.editCustomComponent({
        id: component.id,
        name: name || "",
      })
    );
  };

  const handlePathBlur = () => {
    if (
      !component ||
      path === (component.config as CustomComponentConfig)?.path
    )
      return;
    dispatch(
      actions.editCustomComponent({
        id: component.id,
        path: path || "",
      })
    );
  };
  return (
    <div className="flex flex-col w-full min-w-[315px] max-w-[400px] gap-4 px-3 pb-4 ">
      <ComponentSettingsHeader
        componentId={component.id}
        title={
          (component.config as CustomComponentConfig)?.name ||
          "Custom Component Widget"
        }
        onClose={onClose}
      />

      <div className="flex-1 overflow-auto space-y-4">
        <div className="flex flex-col gap-4">
          <TextInput
            label="Custom Component Name"
            name="custom-component-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameBlur}
            placeholder="Component Name"
          />
          <TextInput
            label="Custom Component Path"
            name="custom-component-path"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            onBlur={handlePathBlur}
            placeholder="Component Path"
            description="Changing the path will generate a new custom file in the custom-components directory."
          />
        </div>
      </div>
      <Separator className="bg-gray-200" />
      <div className="flex items-center justify-end gap-4">
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
              dispatch(actions.removeComponent({ componentId: component.id }));
            }
          }}
        >
          <span className="text-sm font-medium">Remove</span>
          <CircleMinusIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default CustomSettingsContent;
