import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Action, PHDocument } from "document-model";
import { BrushCleaning } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  EditorComponent,
  GroupComponentConfig,
} from "../../../../document-models/document-editor-builder/index.js";
import { actions } from "../../../../document-models/document-editor-builder/index.js";
import { useSchemaEditor } from "../../context/SchemaEditorContext.js";
import { useSelectedDocumentEditorBuilderDocument } from "../../hooks/useDocumentEditorBuilderDocument.js";
import { renderComponent } from "../../utils/component-renderer-utils.js";
import { GroupWrapper } from "./group-wrapper.js";
import UiSchemaDraggingCard from "./ui-schema-dragging-card.js";
import UiSchemaEmptyCard from "./ui-schema-empty-card.js";

interface UiSchemaEditorProps {
  schema: Array<EditorComponent>;
  previewDocument?: PHDocument;
  previewDispatch?: (action: Action) => void;
}

function UiSchemaEditorContent({
  schema,
  previewDocument,
  previewDispatch,
}: UiSchemaEditorProps) {
  const [documentEditor, dispatch] = useSelectedDocumentEditorBuilderDocument();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  const { hoveredGroupId } = useSchemaEditor();

  const [schemaComponents, setSchemaComponents] =
    useState<Array<EditorComponent>>(schema);
  useEffect(() => {
    setSchemaComponents(schema);
  }, [schema]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        if (hoveredGroupId) {
          setSchemaComponents((prev) =>
            prev.filter((component) => component.id !== active.id)
          );
          dispatch(
            actions.addToGroup({
              id: hoveredGroupId,
              componentIds: [active.id as string],
            })
          );
        } else {
          const oldIndex = schema.findIndex(
            (component) => component.id === active.id
          );
          const newIndex = schema.findIndex(
            (component) => component.id === over?.id
          );
          setSchemaComponents(arrayMove(schemaComponents, oldIndex, newIndex));
          dispatch(
            actions.reorderComponents({
              components: [active.id as string],
              insertBefore: over?.id as string | undefined,
            })
          );
        }
      }

      setActiveId(null);
    },
    [dispatch, schema, hoveredGroupId]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const componentsToRender = useMemo(() => {
    const mappedIds = schemaComponents.map((component) => component.id);
    return schemaComponents.filter(
      (component) =>
        !component.groupId || !mappedIds.includes(component.groupId)
    );
  }, [schemaComponents]);

  const groupProps = useMemo(() => {
    return documentEditor?.state.global.groupProps as
      | GroupComponentConfig
      | null
      | undefined;
  }, [documentEditor?.state.global.groupProps]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <GroupWrapper
        groupProps={groupProps}
        usePaddingWrapper={true}
        paddingOnOuter={true}
        innerClassName="relative flex gap-4 w-full flex-1 transition-all duration-1000"
      >
        <SortableContext
          items={componentsToRender.map((component) => component.id)}
          strategy={verticalListSortingStrategy}
        >
          {componentsToRender.map((component) =>
            renderComponent({
              childComponent: component,
              editing: true,
              previewDocument,
              previewDispatch,
              documentType: documentEditor?.state.global.documentType ?? "",
              groupId: component.id,
              className: "",
              schemaComponents,
              documentBuilderDispatch: dispatch,
            })
          )}
        </SortableContext>
        <UiSchemaEmptyCard />
      </GroupWrapper>
      {componentsToRender.length === 0 && (
        <div className="pointer-events-none absolute top-0 left-0 h-full w-full flex flex-col items-center justify-center text-gray-400 gap-2">
          <BrushCleaning className="w-8 h-8" />
          <span className="text-sm ">There is nothing here yet</span>
        </div>
      )}
      <DragOverlay>
        {activeId ? (
          <UiSchemaDraggingCard
            component={
              componentsToRender.find((component) => component.id === activeId)!
            }
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export function UiSchemaEditor(props: UiSchemaEditorProps) {
  return <UiSchemaEditorContent {...props} />;
}

export default UiSchemaEditor;
