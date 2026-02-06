import { Button, NumberInput } from "@powerhousedao/document-engineering/ui";
import { useEffect, useMemo, useState } from "react";
import {
  actions,
  type ActionComponentConfig,
  type EditorComponent,
  type GroupComponentConfig,
  type Layout,
} from "../../../../document-models/document-editor-builder/index.js";

import {
  Columns2Icon,
  Rows2Icon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
} from "lucide-react";
import { useSelectedDocumentEditorBuilderDocument } from "../../hooks/useDocumentEditorBuilderDocument.js";
import { Separator } from "../ui/separator.js";

export default function GroupPropsSection({
  component,
  onUpdate,
}: {
  component: EditorComponent;
  onUpdate?: (updates: Partial<GroupComponentConfig>) => void;
}) {
  const [_, dispatch] = useSelectedDocumentEditorBuilderDocument();

  const config = useMemo(() => {
    if (component.type === "action") {
      return (component.config as ActionComponentConfig).group;
    }
    if (component.type === "group") {
      return component.config as GroupComponentConfig;
    }
    return component.config as GroupComponentConfig;
  }, [component]);

  const [gap, setGap] = useState(config?.gap ?? 0);
  const [paddingTop, setPaddingTop] = useState(config?.paddingTop ?? 0);
  const [paddingRight, setPaddingRight] = useState(config?.paddingRight ?? 0);
  const [paddingBottom, setPaddingBottom] = useState(
    config?.paddingBottom ?? 0
  );
  const [paddingLeft, setPaddingLeft] = useState(config?.paddingLeft ?? 0);
  const [maxWidth, setMaxWidth] = useState(config?.maxWidth ?? null);
  const [maxHeight, setMaxHeight] = useState(config?.maxHeight ?? null);
  const [horizontalOrientation, setHorizontalOrientation] = useState<
    "left" | "center" | "right" | null
  >(config?.horizontalOrientation ?? null);
  const [verticalOrientation, setVerticalOrientation] = useState<
    "top" | "middle" | "bottom" | null
  >(config?.verticalOrientation ?? null);

  useEffect(() => {
    setGap(config?.gap ?? 0);
    setPaddingTop(config?.paddingTop ?? 0);
    setPaddingRight(config?.paddingRight ?? 0);
    setPaddingBottom(config?.paddingBottom ?? 0);
    setPaddingLeft(config?.paddingLeft ?? 0);
    setMaxWidth(config?.maxWidth ?? null);
    setMaxHeight(config?.maxHeight ?? null);
    setHorizontalOrientation(config?.horizontalOrientation ?? null);
    setVerticalOrientation(config?.verticalOrientation ?? null);
  }, [config]);

  const handleUpdate = (updates: Partial<GroupComponentConfig>) => {
    if (onUpdate) {
      onUpdate(updates);
    } else {
      dispatch(
        actions.editGroupComponent({
          id: component.id,
          ...updates,
        })
      );
    }
  };

  return (
    <div className="flex-1 space-y-4">
      {/* Layout */}
      <div className="flex flex-col gap-2">
        <div className="flex  flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">Layout</div>
            <div className="flex items-center gap-2 flex-1">
              {["column", "row"].map((layout) => (
                <Button
                  key={layout}
                  variant={config?.layout === layout ? "outline" : "ghost"}
                  size="icon"
                  onClick={() => handleUpdate({ layout: layout as Layout })}
                  title={layout === "row" ? "Horizontal" : "Vertical"}
                >
                  {layout === "row" ? (
                    <Columns2Icon className="w-4 h-4" />
                  ) : (
                    <Rows2Icon className="w-4 h-4" />
                  )}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-right">
            <div className="text-sm font-medium">Gap</div>

            <NumberInput
              value={gap}
              onChange={(e) =>
                setGap(e.target.value ? Number(e.target.value) : 0)
              }
              onBlur={() => handleUpdate({ gap })}
              name="gap"
              // label="Gap between items"
              placeholder="Enter gap"
              className="max-w-[120px]"
              minValue={0}
            />
          </div>
        </div>
      </div>
      <Separator />

      {/* Padding */}
      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium">Padding</div>
        <div className="grid grid-cols-2 gap-2">
          <NumberInput
            value={paddingLeft}
            onChange={(e) =>
              setPaddingLeft(e.target.value ? Number(e.target.value) : 0)
            }
            onBlur={() => handleUpdate({ paddingLeft })}
            name="paddingLeft"
            label="Left"
            placeholder="0"
            minValue={0}
            className="max-w-[120px]"
          />
          <NumberInput
            value={paddingRight}
            onChange={(e) =>
              setPaddingRight(e.target.value ? Number(e.target.value) : 0)
            }
            onBlur={() => handleUpdate({ paddingRight })}
            name="paddingRight"
            label="Right"
            placeholder="0"
            minValue={0}
            className="max-w-[120px]"
          />
          <NumberInput
            value={paddingTop}
            onChange={(e) =>
              setPaddingTop(e.target.value ? Number(e.target.value) : 0)
            }
            onBlur={() => handleUpdate({ paddingTop })}
            name="paddingTop"
            label="Top"
            placeholder="0"
            className="max-w-[120px]"
            minValue={0}
          />
          <NumberInput
            value={paddingBottom}
            onChange={(e) =>
              setPaddingBottom(e.target.value ? Number(e.target.value) : 0)
            }
            onBlur={() => handleUpdate({ paddingBottom })}
            name="paddingBottom"
            label="Bottom"
            placeholder="0"
            minValue={0}
            className="max-w-[120px]"
          />
        </div>
      </div>
      <Separator />

      {/* Width Constraints */}
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <NumberInput
            value={maxWidth ?? undefined}
            onChange={(e) =>
              setMaxWidth(e.target.value ? Number(e.target.value) : null)
            }
            onBlur={() => handleUpdate({ maxWidth })}
            name="maxWidth"
            label="Max Width"
            placeholder="Auto"
            minValue={0}
            className="max-w-[120px]"
          />
          <NumberInput
            value={maxHeight ?? undefined}
            onChange={(e) =>
              setMaxHeight(e.target.value ? Number(e.target.value) : null)
            }
            onBlur={() => handleUpdate({ maxHeight })}
            name="maxHeight"
            label="Max Height"
            placeholder="Auto"
            minValue={0}
            className="max-w-[120px]"
          />
        </div>
      </div>

      <Separator />
      <div className="flex items-center gap-2">
        {/* Horizontal Orientation */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="text-sm font-medium">Horizontal</div>
          <div className="flex items-center gap-2 flex-1">
            {[
              { value: "left", icon: AlignLeft },
              { value: "center", icon: AlignCenter },
              { value: "right", icon: AlignRight },
            ].map(({ value, icon: Icon }) => (
              <Button
                key={value}
                variant={horizontalOrientation === value ? "outline" : "ghost"}
                size="icon"
                onClick={() => {
                  const newValue =
                    horizontalOrientation === value
                      ? null
                      : (value as "left" | "center" | "right");
                  setHorizontalOrientation(newValue);
                  handleUpdate({ horizontalOrientation: newValue });
                }}
              >
                <Icon className="w-4 h-4" />
              </Button>
            ))}
          </div>
        </div>

        {/* Vertical Orientation */}
        <div className="flex-1 flex flex-col gap-2 ">
          <div className="text-sm font-medium">Vertical</div>
          <div className="flex items-center  gap-2 flex-1">
            {[
              { value: "top", icon: AlignVerticalJustifyStart },
              { value: "middle", icon: AlignVerticalJustifyCenter },
              { value: "bottom", icon: AlignVerticalJustifyEnd },
            ].map(({ value, icon: Icon }) => (
              <Button
                key={value}
                variant={verticalOrientation === value ? "outline" : "ghost"}
                size="icon"
                onClick={() => {
                  const newValue =
                    verticalOrientation === value
                      ? null
                      : (value as "top" | "middle" | "bottom");
                  setVerticalOrientation(newValue);
                  handleUpdate({ verticalOrientation: newValue });
                }}
              >
                <Icon className="w-4 h-4" />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
