import { Button } from "@powerhousedao/document-engineering";
import {
  CircleArrowDownIcon,
  CircleArrowUpIcon,
  GroupIcon,
  Settings2Icon,
  UngroupIcon,
  X,
} from "lucide-react";
import { useSelectedDocumentEditorBuilderDocument } from "../../hooks/useDocumentEditorBuilderDocument.js";
import { useMemo } from "react";
import { actions } from "../../../../document-models/document-editor-builder/index.js";
import { generateId } from "document-model";

interface ComponentSettingsHeaderProps {
  title: string;
  onClose: () => void;
  componentId?: string;
  hideOptions?: boolean;
}

export function ComponentSettingsHeader({
  title,
  componentId,
  onClose,
  hideOptions,
}: ComponentSettingsHeaderProps) {
  const [documentEditor, dispatch] = useSelectedDocumentEditorBuilderDocument();
  const schema = useMemo(() => {
    return documentEditor.state.global.schema.filter(
      (component) => !component.groupId || component.groupId === componentId
    );
  }, [documentEditor]);

  const component = useMemo(() => {
    return documentEditor.state.global.schema.find(
      (component) => component.id === componentId
    );
  }, [documentEditor, componentId]);


  // Calculate index within the same group for move up/down buttons
  const sameGroupComponents = useMemo(() => {
    if (!component) return [];
    const currentGroupId = component.groupId;
    return documentEditor.state.global.schema.filter(
      (c) => c.groupId === currentGroupId
    );
  }, [documentEditor.state.global.schema, component]);

  const componentIndexInGroup = useMemo(() => {
    if (!componentId) return -1;
    return sameGroupComponents.findIndex((c) => c.id === componentId);
  }, [sameGroupComponents, componentId]);

  const handleMoveUp = () => {
    if (componentId === undefined || !component) return;
    const previousComponent = sameGroupComponents[componentIndexInGroup - 1];
    if (!previousComponent) return;
    dispatch(
      actions.reorderComponents({
        components: [componentId],
        insertBefore: previousComponent.id,
      })
    );
  };

  const handleMoveDown = () => {
    if (componentId === undefined || !component) return;
    const nextComponent = sameGroupComponents[componentIndexInGroup + 1];
    if (!nextComponent) return;
    dispatch(
      actions.reorderComponents({
        components: [componentId],
        insertBefore: nextComponent.id,
      })
    );
  };

  const handleGroup = () => {
    if (componentId === undefined) return;
    dispatch(
      actions.createGroup({
        id: generateId(),
        componentIds: [componentId],
        insertBefore: componentId,
      })
    );
  };

  const handleUnGroup = () => {
    if (componentId === undefined) return;
    if (!component?.groupId) return;
    dispatch(
      actions.removeFromGroup({
        id: component.groupId,
        componentIds: [componentId],
      })
    );
  };

  return (
    <div className="pt-4 px-3 flex items-center justify-between gap-4 pb-3 border-b border-gray-200">
      <div className="flex gap-1 items-center">
        <Settings2Icon className="w-4 h-4" />
        <div className="text-sm font-semibold truncate">{title}</div>
      </div>
      <div className="flex items-center gap-2">
        {!hideOptions && (
          <>
            {component?.groupId && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleUnGroup}
                aria-label={"Ungroup"}
                className="w-5 h-5"
              >
                <UngroupIcon className="text-gray-500" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGroup}
              aria-label={"Group"}
              className="w-5 h-5"
            >
              <GroupIcon className="text-gray-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMoveUp}
              aria-label="Move up"
              className="w-5 h-5"
              disabled={componentIndexInGroup === 0}
            >
              <CircleArrowUpIcon className="text-gray-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMoveDown}
              aria-label="Move down"
              className="w-5 h-5"
              disabled={
                componentIndexInGroup === sameGroupComponents.length - 1
              }
            >
              <CircleArrowDownIcon className="text-gray-500" />
            </Button>
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close"
          className="w-5 h-5"
        >
          <X />
        </Button>
      </div>
    </div>
  );
}

export default ComponentSettingsHeader;
