import type { HTMLAttributes } from "react";
import type {
  EditorComponent,
  SpacerComponentConfig,
} from "../../../../../document-models/document-editor-builder/index.js";
import UiSchemaWrapperCard from "../ui-schema-wrapper-card.js";
import { SpaceIcon } from "lucide-react";
import { cn } from "../../../lib/utils.js";
import { SpacerSettingsContent } from "../../component-settings/SpacerSettingsContent.js";

interface UiSchemaSpacerCardProps extends HTMLAttributes<HTMLDivElement> {
  editing: boolean;
  component: EditorComponent;
  groupId?: string;
}

export function UiSchemaSpacerCard({
  editing,
  component,
  className,
  groupId,
}: UiSchemaSpacerCardProps) {
  const config = component.config as SpacerComponentConfig;
  const width = config?.width;
  const height = config?.height;

  const style: React.CSSProperties = {};
  if (width !== null && width !== undefined) {
    style.width = `${width}px`;
  }
  if (height !== null && height !== undefined) {
    style.height = `${height}px`;
  }

  return (
    <UiSchemaWrapperCard
      editing={editing}
      component={component}
      className={className}
      groupId={groupId}
      WidgetIcon={SpaceIcon}
      title="Spacer"
      SettingsContent={SpacerSettingsContent}
    >
      {/* Empty content - just fills space */}
      <div
        className={cn(
          width === null || width === undefined ? "w-full" : "",
          height === null || height === undefined ? "h-full" : "",
          editing && (height === null || height === undefined)
            ? "min-h-[40px]"
            : ""
        )}
        style={Object.keys(style).length > 0 ? style : undefined}
      />
    </UiSchemaWrapperCard>
  );
}
