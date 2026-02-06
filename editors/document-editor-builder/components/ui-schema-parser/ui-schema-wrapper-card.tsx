import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { LucideIcon } from "lucide-react";
import { Ellipsis, GripVertical } from "lucide-react";
import { useEffect, useMemo, useState, type HTMLAttributes } from "react";
import { type EditorComponent } from "../../../../document-models/document-editor-builder/index.js";
import { useSchemaEditor } from "../../context/SchemaEditorContext.js";
import { cn } from "../../lib/utils.js";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover.js";

export const HIGHLIGHT_GROUP_DELAY = 800;

interface UiSchemaWrapperCardProps extends HTMLAttributes<HTMLDivElement> {
  editing: boolean;
  component: EditorComponent;
  groupId?: string;
  WidgetIcon: LucideIcon;
  SettingsContent: React.FC<{
    component: EditorComponent;
    onClose: () => void;
  }>;
  title: string;
}

export function UiSchemaWrapperCard({
  editing,
  component,
  className,
  WidgetIcon,
  title,
  SettingsContent,
  children,
}: UiSchemaWrapperCardProps) {
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
    id: component.id,
    disabled: !editing,
    data: {
      groupId:
        component.type === "group" || component.type === "action"
          ? component.id
          : undefined,
    },
  });

  const overGroupId = useMemo(() => {
    if (!editing) {
      return null;
    }

    return over?.data.current?.groupId as string | null;
  }, [editing, over]);

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

  const [openMenu, setOpenMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isGroup = component.type === "group";
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative",
        editing
          ? "rounded-md transition-all duration-300 min-w-[180px] flex-1 border " +
              (isGroup || component.type === "action"
                ? hoveredGroupId === component.id
                  ? "border-blue-500"
                  : !hoveredGroupId && overGroupId === component.id
                  ? "border-gray-400"
                  : "border-gray-200"
                : "border border-gray-200 bg-[#F9F9F9]")
          : "",
        component.type === "custom" ? "border-none!" : "",
        isDragging ? "border-black opacity-50" : "",
        hoveredGroupId && isDragging ? "opacity-0 border-none" : "",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...attributes}
      tabIndex={-1}
    >
      {editing && !isDragging && (
        <div
          className={cn(
            "absolute border border-[#D6D6D6] rounded-sm z-1 shadow-sm flex items-center gap-1",
            isGroup
              ? " -top-2 mx-auto left-0 right-0 w-fit px-1 bg-[#E8E8E8]"
              : " -top-1 left-1 px-1 bg-[#FBFBFB]",

            isGroup ? "text-gray-500" : "text-primary-blue"
          )}
        >
          <div
            ref={setActivatorNodeRef}
            {...listeners}
            className={cn(
              isDragging ? "cursor-grabbing" : "cursor-grab",
              "transition-all duration-300",
              openMenu || isHovered ? "w-3 opacity-100" : "w-0 opacity-0"
            )}
          >
            <GripVertical className="w-3 h-3" />
          </div>
          <span className={cn("flex flex-1 items-center gap-1")}>
            {WidgetIcon && <WidgetIcon className="w-3 h-3" />}
            <span className="text-xs font-semibold">{title}</span>
          </span>
          <Popover
            open={openMenu}
            onOpenChange={(v) => {
              // allow onBlur to run on settings fields
              setTimeout(() => setOpenMenu(v), v ? 0 : 10);
            }}
          >
            <PopoverTrigger className="p-0 border-0 bg-transparent">
              <div
                className={cn(
                  "cursor-pointer transition-all duration-300",
                  openMenu || isHovered ? "w-3 opacity-100" : "w-0 opacity-0"
                )}
              >
                <Ellipsis className="w-3 h-3" />
              </div>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="p-0 bg-[#F9F9F9] border border-gray-200 shadow-lg w-[360px] max-w-[90vw]"
            >
              <SettingsContent
                component={component}
                onClose={() => {
                  setOpenMenu(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {!isDragging && (
        <div className={editing ? "overflow-auto h-full" : "h-full"}>
          {children}
        </div>
      )}
    </div>
  );
}

export default UiSchemaWrapperCard;
