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
import { Form } from "@powerhousedao/document-engineering/scalars";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { UseFormReturn } from "@powerhousedao/document-editor-builder/components";
import {
  actions,
  type ActionComponentConfig,
  type EditorComponent,
  type GroupComponentConfig,
} from "../../../../../document-models/document-editor-builder/index.js";

import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import type { PHDocument } from "document-model";
import { FieldGroup } from "../../../components/ui/field.js";
import { useSchemaEditor } from "../../../context/SchemaEditorContext.js";
import { cn } from "../../../lib/utils.js";
import { GroupWrapper } from "../group-wrapper.js";
import UiSchemaDraggingCard from "../ui-schema-dragging-card.js";
import UiSchemaEmptyCard from "../ui-schema-empty-card.js";
import type { ComponentRendererProps } from "../../../utils/component-renderer-utils.js";

interface ActionCardFormControlProps {
  component: EditorComponent;
  childComponents: Array<EditorComponent>;
  editing: boolean;
  handleSubmit: (formProps: UseFormReturn) => Promise<void>;
  defaultValues: Record<string, string | number | boolean | null | undefined>;
  optionalFieldsMap: Map<string, boolean>;
  enumOptionsMap?: Map<string, string[]>;
  documentBuilderDispatch?: DocumentDispatch<any>;
  previewDocument?: PHDocument;
  previewDispatch?: DocumentDispatch<any>;
  schemaComponents?: Array<EditorComponent>;
  documentType?: string;
  renderComponent: (props: ComponentRendererProps) => ReactNode;
}

export const ActionCardFormControl = ({
  component,
  childComponents,
  editing,
  handleSubmit,
  defaultValues,
  optionalFieldsMap,
  enumOptionsMap,
  documentBuilderDispatch,
  previewDocument,
  previewDispatch,
  schemaComponents,
  documentType,
  renderComponent,
}: ActionCardFormControlProps) => {
  const { hoveredGroupId } = useSchemaEditor();
  const formRef = useRef<UseFormReturn>(null);
  const prevDefaultValuesRef = useRef<typeof defaultValues | null>(null);
  const config = useMemo(
    () => component.config as ActionComponentConfig,
    [component.config]
  );

  useEffect(() => {
    const form = formRef.current;
    if (!form || !component) return;

    const currentValues = form.getValues() as typeof defaultValues;
    const prevDefaultValues = prevDefaultValuesRef.current;

    // Build merged values: start with new defaults
    const mergedValues = { ...defaultValues };

    // If we have previous defaults, check which fields user had edited
    if (prevDefaultValues) {
      for (const key of Object.keys(currentValues)) {
        // If current value differs from previous default, user edited it - keep it
        if (currentValues[key] !== prevDefaultValues[key]) {
          mergedValues[key] = currentValues[key];
        }
      }
    }

    // Store current defaults for next comparison
    prevDefaultValuesRef.current = { ...defaultValues };

    form.reset(mergedValues);
  }, [component, config?.formProps?.trigger, defaultValues]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [activeId, setActiveId] = useState<string | null>(null);

  const [componentFields, setComponentFields] = useState<
    Array<EditorComponent>
  >(childComponents || []);

  useEffect(() => {
    setComponentFields(childComponents || []);
  }, [childComponents]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        if (hoveredGroupId) {
          setComponentFields((prev) =>
            prev.filter((component) => component.id !== active.id)
          );
          documentBuilderDispatch?.(
            actions.addToGroup({
              id: hoveredGroupId,
              componentIds: [active.id as string],
            })
          );
        } else {
          const oldIndex = componentFields?.findIndex(
            (field) => field.id === active.id
          );
          const newIndex = componentFields?.findIndex(
            (field) => field.id === over?.id
          );
          setComponentFields(arrayMove(componentFields, oldIndex, newIndex));
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
    [documentBuilderDispatch, componentFields, hoveredGroupId]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const renderChildComponent = (
    childComponent: EditorComponent,
    formProps?: UseFormReturn & {
      triggerSubmit: () => void;
      formId: string;
    }
  ) => {
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
      formProps: formProps
        ? {
            ...formProps,
            resetForm: () => {
              formRef.current?.reset(defaultValues);
            },
          }
        : undefined,
      optionalFieldsMap,
      enumOptionsMap,
      formTrigger:
        config?.formProps?.trigger === "onSubmit" ||
        config?.formProps?.trigger === "onChange" ||
        config?.formProps?.trigger === "onBlur"
          ? config.formProps.trigger
          : undefined,
    });
  };

  const activeComponent = useMemo(() => {
    return componentFields.find((field) => field.id === activeId);
  }, [componentFields, activeId]);

  const groupConfig = useMemo(() => {
    return config?.group as GroupComponentConfig | undefined;
  }, [config?.group]);

  const triggerSubmit = useCallback(() => {
    handleSubmit(formRef.current as UseFormReturn);
  }, [handleSubmit]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <Form
        onSubmit={triggerSubmit}
        defaultValues={defaultValues}
        ref={formRef}
      >
        {(formProps) => {
          return (
            <GroupWrapper
              groupProps={groupConfig}
              usePaddingWrapper={false}
              paddingOnOuter={false}
              as={FieldGroup}
              outerClassName={cn(
                "gap-2 transition-all duration-1000",
                groupConfig?.maxHeight ? "h-full" : ""
              )}
              innerClassName="flex flex-1 w-full transition-all duration-1000"
            >
              <SortableContext
                items={componentFields?.map((field) => field.id)}
                strategy={
                  groupConfig?.layout === "row"
                    ? horizontalListSortingStrategy
                    : verticalListSortingStrategy
                }
              >
                {componentFields?.map((field) => {
                  return renderChildComponent(field, formProps);
                })}
              </SortableContext>
              {editing && (
                <div className={cn("flex")}>
                  <UiSchemaEmptyCard
                    size="sm"
                    groupId={component.id}
                    noActionOption
                  />
                </div>
              )}
            </GroupWrapper>
          );
        }}
      </Form>
      <DragOverlay>
        {activeId && activeComponent ? (
          <UiSchemaDraggingCard component={activeComponent} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
