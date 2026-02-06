import type React from "react";
import { type ReactNode } from "react";
import type { GroupComponentConfig } from "../../../../document-models/document-editor-builder/index.js";
import { cn } from "../../lib/utils.js";

interface GroupWrapperProps {
  groupProps?: GroupComponentConfig | null;
  children: ReactNode;
  /**
   * Whether to use a 3-layer structure with padding wrapper (for root level)
   * If false, uses 2-layer structure (for nested groups)
   */
  usePaddingWrapper?: boolean;
  /**
   * Additional classes for the outer container
   */
  outerClassName?: string;
  /**
   * Additional classes for the middle container (orientation container)
   */
  middleClassName?: string;
  /**
   * Additional classes for the inner container (layout container)
   */
  innerClassName?: string;
  /**
   * Whether padding should be applied to the outer wrapper (when usePaddingWrapper is true)
   * or to the inner container (when usePaddingWrapper is false)
   */
  paddingOnOuter?: boolean;
  /**
   * Custom wrapper element (e.g., FieldGroup)
   */
  as?: React.ElementType;
}

/**
 * Reusable wrapper component that applies groupProps styling consistently
 * across ui-schema-editor, ui-schema-preview, action-form-control, and group-card
 */
export function GroupWrapper({
  groupProps,
  children,
  usePaddingWrapper = false,
  outerClassName = "",
  middleClassName = "",
  innerClassName = "",
  paddingOnOuter = true,
  as: WrapperElement = "div",
}: GroupWrapperProps) {
  const orientationClasses = cn(
    // Horizontal orientation
    groupProps?.horizontalOrientation === "left" && "justify-start",
    groupProps?.horizontalOrientation === "center" && "justify-center",
    groupProps?.horizontalOrientation === "right" && "justify-end",
    // Vertical orientation
    groupProps?.verticalOrientation === "top" && "items-start",
    groupProps?.verticalOrientation === "middle" && "items-center",
    groupProps?.verticalOrientation === "bottom" && "items-end",
    groupProps?.layout === "row" && "overflow-x-auto"
  );

  const layoutClasses = cn(
    "flex",
    groupProps?.layout === "column" ? "flex-col" : "flex-row"
  );

  const paddingStyle = paddingOnOuter
    ? {
        paddingTop: `${groupProps?.paddingTop ?? 0}px`,
        paddingRight: `${groupProps?.paddingRight ?? 0}px`,
        paddingBottom: `${groupProps?.paddingBottom ?? 0}px`,
        paddingLeft: `${groupProps?.paddingLeft ?? 0}px`,
      }
    : {};

  const innerPaddingStyle = !paddingOnOuter
    ? {
        paddingTop: `${groupProps?.paddingTop ?? 0}px`,
        paddingRight: `${groupProps?.paddingRight ?? 0}px`,
        paddingBottom: `${groupProps?.paddingBottom ?? 0}px`,
        paddingLeft: `${groupProps?.paddingLeft ?? 0}px`,
      }
    : {};

  const innerStyle = {
    gap: groupProps?.gap ?? 0,
    ...innerPaddingStyle,
    minWidth: groupProps?.minWidth ? `${groupProps.minWidth}px` : undefined,
    maxWidth: groupProps?.maxWidth ? `${groupProps.maxWidth}px` : undefined,
    minHeight: groupProps?.minHeight ? `${groupProps.minHeight}px` : undefined,
    maxHeight: groupProps?.maxHeight ? `${groupProps.maxHeight}px` : undefined,
    overflow:
      groupProps?.maxHeight !== null && groupProps?.maxHeight !== undefined
        ? "auto"
        : undefined,
    width: groupProps?.maxWidth ? `100%` : undefined,
  };

  if (usePaddingWrapper) {
    // 3-layer structure: padding wrapper -> orientation container -> layout container
    return (
      <WrapperElement
        className={cn(
          "flex overflow-auto flex-1 p-4 transition-all duration-1000",
          outerClassName
        )}
      >
        <div
          className={cn(
            "flex h-full flex-1 transition-all duration-1000",
            orientationClasses,
            middleClassName
          )}
          style={paddingStyle}
        >
          <div className={cn(layoutClasses, innerClassName)} style={innerStyle}>
            {children}
          </div>
        </div>
      </WrapperElement>
    );
  }

  // 2-layer structure: orientation container -> layout container
  return (
    <WrapperElement
      className={cn("flex", orientationClasses, outerClassName)}
      style={paddingStyle}
    >
      <div className={cn(layoutClasses, innerClassName)} style={innerStyle}>
        {children}
      </div>
    </WrapperElement>
  );
}
