import { CircleMinusIcon } from "lucide-react";
import {
  actions,
  type EditorComponent,
} from "../../../../document-models/document-editor-builder/index.js";

import { Button, confirm } from "@powerhousedao/document-engineering/ui";
import { useSelectedDocumentEditorBuilderDocument } from "../../hooks/useDocumentEditorBuilderDocument.js";
import { ComponentSettingsHeader } from "./ComponentSettingsHeader.js";
import GroupPropsSection from "./GroupPropsSection.js";
import { Separator } from "../ui/separator.js";

export function GroupSettingsContent({
  component,
  onClose,
}: {
  component: EditorComponent;
  onClose: () => void;
}) {
  const [_, dispatch] = useSelectedDocumentEditorBuilderDocument();
  return (
    <div className="flex flex-col w-full min-w-[315px] gap-4">
      <ComponentSettingsHeader
        componentId={component.id}
        title="Group Widget"
        onClose={onClose}
      />

      <div className="flex flex-col px-4 pb-4 gap-4">
        <GroupPropsSection component={component} />
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

export default GroupSettingsContent;
