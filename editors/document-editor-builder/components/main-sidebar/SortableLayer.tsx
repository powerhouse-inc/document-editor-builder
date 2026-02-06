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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@powerhousedao/document-engineering";
import { generateId } from "document-model";
import {
  BaselineIcon,
  ChevronDown,
  CodeIcon,
  EyeIcon,
  GripVertical,
  Group,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  PilcrowIcon,
  ListIcon,
  TypeIcon,
  Ungroup,
  TextCursorInputIcon,
  SpaceIcon,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  actions,
  type CustomComponentConfig,
  type EditorComponent,
  type ActionComponentConfig,
  type ContentComponentConfig,
  type InputComponentConfig,
} from "../../../../document-models/document-editor-builder/index.js";
import { useSelectedDocumentEditorBuilderDocument } from "../../hooks/useDocumentEditorBuilderDocument.js";
import { cn } from "../../lib/utils.js";
import { useSchemaEditor } from "../../context/SchemaEditorContext.js";
import { HIGHLIGHT_GROUP_DELAY } from "../ui-schema-parser/ui-schema-wrapper-card.js";

interface SortableLayerProps {
  id: string;
  icon: ReactNode;
  name: string;
  component: EditorComponent;
  groupId?: string;
}

export const LayerIcon = (c: EditorComponent) => {
  const obj = {
    action: <BaselineIcon size={16} />,
    content:
      (c.config as ContentComponentConfig)?.scope !== null ? (
        <EyeIcon size={16} />
      ) : c.control === "title" ? (
        <Heading1Icon size={16} />
      ) : c.control === "subtitle" ? (
        <Heading2Icon size={16} />
      ) : c.control === "label" ? (
        <Heading3Icon size={16} />
      ) : c.control === "paragraph" ? (
        <PilcrowIcon size={16} />
      ) : c.control === "bulletList" ? (
        <ListIcon size={16} />
      ) : (
        <TypeIcon size={16} />
      ),
    group: <Group size={16} />,
    custom: <CodeIcon size={16} />,
    input: <TextCursorInputIcon size={16} />,
    spacer: <SpaceIcon size={16} />,
  };
  return obj[c.type as keyof typeof obj];
};

export const LayerName = (c: EditorComponent) => {
  const obj = {
    action: (c.config as ActionComponentConfig)?.action?.name || "Form",
    input: (c.config as InputComponentConfig)?.field?.name || "Input",
    content:
      (c.config as ContentComponentConfig)?.scope !== null
        ? (c.config as ContentComponentConfig)?.scope || "State Text"
        : c.control,
    title: "Title",
    subtitle: "Subtitle",
    label: "Label",
    paragraph: "Paragraph",
    bulletList: "Bullet List",
    group: "Group",
    custom: (c.config as CustomComponentConfig)?.name || "Custom Component",
    spacer: "Spacer",
  };
  return obj[c.type as keyof typeof obj];
};

export default function SortableLayer({
  id,
  icon,
  name,
  component,
  groupId,
}: SortableLayerProps) {
  const [documentEditor, dispatch] = useSelectedDocumentEditorBuilderDocument();
  const { setHoveredGroupId, hoveredGroupId } = useSchemaEditor();
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
    over,
  } = useSortable({
    id,
    data: { groupId: component.type === "group" ? component.id : undefined },
  });

  const components = useMemo(() => {
    return documentEditor.state.global.schema.filter(
      (c) => c.groupId === component.id
    );
  }, [documentEditor.state.global.schema, component.id]);

  const isGroup = useMemo(() => component.type === "group", [component]);

  const overGroupId = useMemo(() => {
    return over?.data.current?.groupId as string | null;
  }, [over]);

  useEffect(() => {
    if (!overGroupId) {
      setHoveredGroupId(null);
      return;
    }

    // Reset hoveredGroupId to null when switching groups to restart the logic
    setHoveredGroupId(null);

    const timeoutId = window.setTimeout(() => {
      setHoveredGroupId(overGroupId);
    }, HIGHLIGHT_GROUP_DELAY);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [overGroupId, setHoveredGroupId]);

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const [groupOpen, setGroupOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [activeId, setActiveId] = useState<string | null>(null);

  const [componentArray, setComponentArray] =
    useState<Array<EditorComponent>>(components);

  useEffect(() => {
    setComponentArray(components);
  }, [components]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        const oldIndex = (components || []).findIndex(
          (c) => c.id === active.id
        );
        const newIndex = (components || []).findIndex((c) => c.id === over?.id);
        setComponentArray(arrayMove(componentArray, oldIndex, newIndex));

        dispatch?.(
          actions.reorderComponents({
            components: [active.id as string],
            insertBefore: over?.id as string | undefined,
          })
        );
      }
    },
    [dispatch, componentArray]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex flex-col gap-1 pb-0 text-[#5F5F5F] rounded-md border border-transparent ",
        isGroup
          ? hoveredGroupId === component.id
            ? "border-blue-500"
            : groupId
              ? ""
              : "cursor-pointer border-gray-200 hover:bg-gray-50"
          : "",
        groupOpen && "group hover:border-gray-200 hover:bg-[#F3F3F3] pb-1",
        isDragging ? "cursor-grabbing border-black bg-gray-50 z-1 pb-0" : "",
        hoveredGroupId && isDragging ? "opacity-0 h-6 border-none" : ""
      )}
      {...attributes}
      onClick={() => {
        if (isGroup) {
          setGroupOpen(!groupOpen);
        }
      }}
    >
      {isDragging ? (
        <div className="flex items-center w-full h-6"></div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          <SortableContext
            items={componentArray.map((component) => component.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-1">
              <div
                className={cn(
                  "flex items-center gap-2",
                  groupOpen && "group-hover:bg-[#EEEEEE] rounded-md"
                )}
              >
                <div
                  ref={setActivatorNodeRef}
                  {...listeners}
                  className={cn(
                    "transition-all duration-300 overflow-hidden w-3",
                    isDragging
                      ? "cursor-grabbing opacity-100"
                      : "cursor-grab  opacity-0",
                    "group-hover:opacity-100"
                  )}
                >
                  <GripVertical size={14} />
                </div>
                <div className="flex items-center gap-1 flex-1">
                  {icon}
                  <span className="text-xs font-semibold flex-1">{name}</span>
                </div>
                {!groupId ? (
                  <>
                    {isGroup ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-5 h-5"
                        onClick={(e) => {
                          e.stopPropagation();
                          setGroupOpen(!groupOpen);
                        }}
                      >
                        <ChevronDown
                          size={16}
                          className={cn(
                            "transition-all duration-300",
                            !groupOpen ? "rotate-180" : ""
                          )}
                        />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-5 h-5"
                        onClick={() => {
                          dispatch(
                            actions.createGroup({
                              id: generateId(),
                              componentIds: [component.id],
                              insertBefore: component.id,
                            })
                          );
                        }}
                      >
                        <Group size={16} />
                      </Button>
                    )}
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-5 h-5"
                    onClick={() => {
                      dispatch(
                        actions.removeFromGroup({
                          id: groupId,
                          componentIds: [component.id],
                        })
                      );
                    }}
                  >
                    <Ungroup size={16} />
                  </Button>
                )}
              </div>

              {groupOpen && !isDragging && (
                <div className="flex flex-col gap-1 pl-4">
                  {componentArray.map((child) => (
                    <SortableLayer
                      key={child.id}
                      id={child.id}
                      icon={LayerIcon(child)}
                      name={LayerName(child)}
                      component={child}
                      groupId={component.id}
                    />
                  ))}
                </div>
              )}
            </div>
            <DragOverlay>
              {activeId ? (
                <SortableLayerOverlay
                  icon={LayerIcon(
                    componentArray.find((c) => c.id === activeId)!
                  )}
                  name={LayerName(
                    componentArray.find((c) => c.id === activeId)!
                  )}
                />
              ) : null}
            </DragOverlay>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

export function SortableLayerOverlay({
  icon,
  name,
}: {
  icon: ReactNode;
  name: string;
}) {
  return (
    <div className="cursor-grabbing  relative flex flex-col gap-1 pb-0 text-[#5F5F5F] rounded-md border border-gray-200 bg-white shadow-sm min-w-[200px]">
      <div className="flex items-center gap-2 px-2 py-1">
        <div className="w-3 text-gray-300">
          <GripVertical size={14} />
        </div>
        {icon}
        <span className="text-xs font-semibold flex-1">{name}</span>
      </div>
    </div>
  );
}
