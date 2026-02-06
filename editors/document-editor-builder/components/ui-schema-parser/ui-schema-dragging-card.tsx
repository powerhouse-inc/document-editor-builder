import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import {
  type EditorComponent,
} from "../../../../document-models/document-editor-builder/index.js";
import { cn } from "../../lib/utils.js";
import { LayerIcon, LayerName } from "../main-sidebar/SortableLayer.js";
import { useMemo } from "react";

interface UiSchemaDraggingCardProps {
  component: EditorComponent;
}

export function UiSchemaDraggingCard({ component }: UiSchemaDraggingCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component?.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const title = useMemo(() => {
    return LayerName(component);
  }, [component.type]);

  const WidgetIcon = useMemo(() => {
    return LayerIcon(component);
  }, [component.type]);

  return (
    component && (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "relative group w-fit cursor-grabbing",
          "rounded-md transition-all duration-300 border border-gray-300 bg-gray-100"
        )}
        {...attributes}
      >
        <div
          className={cn(
            " transition-opacity duration-300 flex items-center justify-between px-3 h-4"
          )}
        >
          <div
            className={cn(
              "flex items-center gap-1",
              component.type === "group" ? "text-gray-500" : "text-primary-blue"
            )}
          >
            <div
              ref={setActivatorNodeRef}
              {...listeners}
              className={isDragging ? "cursor-grabbing" : "cursor-grab"}
            >
              <GripVertical className=" w-3 h-3" />
            </div>

            <span className={cn("flex flex-1 items-center gap-1")}>
              {WidgetIcon}
              <span className="text-xs font-semibold">{title}</span>
            </span>
          </div>
        </div>
      </div>
    )
  );
}

export default UiSchemaDraggingCard;
