import { Button, NumberInput } from "@powerhousedao/document-engineering";
import { CircleMinusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  actions,
  type EditorComponent,
  type SpacerComponentConfig,
} from "../../../../document-models/document-editor-builder/index.js";
import { useSelectedDocumentEditorBuilderDocument } from "../../hooks/useDocumentEditorBuilderDocument.js";
import { ComponentSettingsHeader } from "./ComponentSettingsHeader.js";
import { Separator } from "../ui/separator.js";
import { confirm } from "@powerhousedao/document-engineering";

export function SpacerSettingsContent({
  component,
  onClose,
}: {
  component: EditorComponent;
  onClose: () => void;
}) {
  const [_, dispatch] = useSelectedDocumentEditorBuilderDocument();
  const config = component.config as SpacerComponentConfig;

  const [width, setWidth] = useState<number | null>(config?.width ?? null);
  const [height, setHeight] = useState<number | null>(config?.height ?? null);

  useEffect(() => {
    setWidth(config?.width ?? null);
    setHeight(config?.height ?? null);
  }, [component]);


  const handleHeightBlur = () => {
    if (!component) return;
    const currentHeight = config?.height ?? null;
    if (height === currentHeight) return;

    dispatch(
      actions.editSpacerComponent({
        id: component.id,
        height: height,
      })
    );
  };

  return (
    <div className="flex flex-col w-full min-w-[315px] max-w-[400px] gap-4 px-3 pb-4">
      <ComponentSettingsHeader
        componentId={component.id}
        title="Spacer Widget"
        onClose={onClose}
      />

      <div className="flex flex-col gap-4">
        {/* <div className="flex flex-col gap-2">
          <NumberInput
            label="Width (px)"
            name="spacer-width"
            value={width ?? undefined}
            onChange={(e) =>
              setWidth(e.target.value ? Number(e.target.value) : null)
            }
            onBlur={handleWidthBlur}
            placeholder="Auto"
          />
        </div> */}

        <div className="flex flex-col gap-2">
          <NumberInput
            label="Height (px)"
            name="spacer-height"
            value={height ?? undefined}
            onChange={(e) =>
              setHeight(e.target.value ? Number(e.target.value) : null)
            }
            onBlur={handleHeightBlur}
            placeholder="Auto"
          />
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
