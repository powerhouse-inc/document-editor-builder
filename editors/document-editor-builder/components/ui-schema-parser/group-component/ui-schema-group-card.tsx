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
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import type { PHDocument } from "document-model";
import { Group } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import type { UseFormReturn } from "@powerhousedao/document-editor-builder/components";
import {
  actions,
  type EditorComponent,
  type GroupComponentConfig,
} from "../../../../../document-models/document-editor-builder/index.js";
import { cn } from "../../../lib/utils.js";
import type { ComponentRendererProps } from "../../../utils/component-renderer-utils.js";
import { hasParentAction } from "../../../utils/component-utils.js";
import GroupSettingsContent from "../../component-settings/GroupSettingsContent.js";
import { GroupWrapper } from "../group-wrapper.js";
import UiSchemaDraggingCard from "../ui-schema-dragging-card.js";
import UiSchemaEmptyCard from "../ui-schema-empty-card.js";
import UiSchemaWrapperCard from "../ui-schema-wrapper-card.js";
import { useSchemaEditor } from "../../../context/SchemaEditorContext.js";

interface UiSchemaGroupCardProps extends HTMLAttributes<HTMLDivElement> {
  editing: boolean;
  component: EditorComponent;
  previewDocument?: PHDocument;
  previewDispatch?: DocumentDispatch<any>;
  documentType?: string;
  childComponents?: Array<EditorComponent>;
  groupId?: string;
  schemaComponents?: Array<EditorComponent>;
  documentBuilderDispatch?: DocumentDispatch<any>;
  // Form props (optional, only needed when group contains inputs)
  formProps?: UseFormReturn & {
    triggerSubmit: () => void;
    formId: string;
  };
  optionalFieldsMap?: Map<string, boolean>;
  enumOptionsMap?: Map<string, string[]>;
  formTrigger?: "onSubmit" | "onChange" | "onBlur";
  renderComponent: (props: ComponentRendererProps) => ReactNode;
}

export function UiSchemaGroupCard({
  editing,
  component,
  previewDocument,
  previewDispatch,
  className,
  documentType,
  childComponents,
  schemaComponents,
  groupId,
  documentBuilderDispatch,
  formProps,
  optionalFieldsMap,
  enumOptionsMap,
  formTrigger,
  renderComponent,
}: UiSchemaGroupCardProps) {
  const { hoveredGroupId } = useSchemaEditor();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [activeId, setActiveId] = useState<string | null>(null);

  const [componentArray, setComponentArray] = useState<Array<EditorComponent>>(
    childComponents || []
  );

  useEffect(() => {
    setComponentArray(childComponents || []);
  }, [childComponents]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        if (hoveredGroupId) {
          setComponentArray((prev) =>
            prev.filter((component) => component.id !== active.id)
          );
          documentBuilderDispatch?.(
            actions.addToGroup({
              id: hoveredGroupId,
              componentIds: [active.id as string],
            })
          );
        } else {
          const oldIndex = (childComponents || []).findIndex(
            (c) => c.id === active.id
          );
          const newIndex = (childComponents || []).findIndex(
            (c) => c.id === over?.id
          );
          setComponentArray(arrayMove(componentArray, oldIndex, newIndex));

          documentBuilderDispatch?.(
            actions.reorderComponents({
              components: [active.id as string],
              insertBefore: over?.id as string | undefined,
            })
          );
        }
      }

      setActiveId(null);
    },
    [documentBuilderDispatch, componentArray, hoveredGroupId]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active?.id as string);
  }, []);

  const renderChildComponent = (childComponent: EditorComponent) => {
    return renderComponent({
      childComponent,
      editing,
      previewDocument,
      previewDispatch,
      documentType,
      groupId: component.id,
      schemaComponents,
      documentBuilderDispatch,
      className: "flex-1 min-w-[180px]",
      formProps,
      optionalFieldsMap,
      enumOptionsMap,
      formTrigger,
    });
  };

  const componentHasParentAction = useMemo(() => {
    return hasParentAction(component, schemaComponents);
  }, [component, schemaComponents]);

  const groupConfig = useMemo(() => {
    return component.config as GroupComponentConfig;
  }, [component]);

  return (
    <UiSchemaWrapperCard
      editing={editing}
      component={component}
      className={className}
      groupId={groupId}
      WidgetIcon={Group}
      title="Group"
      SettingsContent={GroupSettingsContent}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <GroupWrapper
          groupProps={groupConfig}
          usePaddingWrapper={false}
          paddingOnOuter={false}
          outerClassName={cn(
            "gap-2",
            editing ? "px-3 pb-3 pt-6 transition-all duration-1000" : "",
            groupConfig?.maxHeight ? "h-full" : ""
          )}
          innerClassName="flex flex-1 w-full transition-all duration-1000"
        >
          <SortableContext
            items={componentArray.map((c) => c.id)}
            strategy={
              groupConfig?.layout === "row"
                ? horizontalListSortingStrategy
                : verticalListSortingStrategy
            }
          >
            {componentArray.map((component) => renderChildComponent(component))}
          </SortableContext>
          {editing && (
            <div
              className={cn("flex", {
                "w-full": componentArray.length === 0,
              })}
            >
              <UiSchemaEmptyCard
                size="sm"
                noActionOption={componentHasParentAction}
                groupId={component.id}
              />
            </div>
          )}
        </GroupWrapper>
        <DragOverlay>
          {activeId && componentArray.length > 0 ? (
            <UiSchemaDraggingCard
              component={componentArray.find((c) => c.id === activeId)!}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </UiSchemaWrapperCard>
  );
}

export default UiSchemaGroupCard;
