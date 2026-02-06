import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import type { PHDocument } from "document-model";
import { CodeIcon } from "lucide-react";
import { type HTMLAttributes } from "react";
import {
  type CustomComponentConfig,
  type EditorComponent,
} from "../../../../../document-models/document-editor-builder/index.js";
import { useCustomComponent } from "../../../hooks/useCustomComponent.js";
import { cn } from "../../../lib/utils.js";
import { CustomSettingsContent } from "../../component-settings/CustomSettingsContent.js";
import UiSchemaWrapperCard from "../ui-schema-wrapper-card.js";
import type { UseFormReturn } from "@powerhousedao/document-editor-builder/components";

interface UiSchemaCustomCardProps extends HTMLAttributes<HTMLDivElement> {
  editing: boolean;
  component: EditorComponent;
  previewDocument?: PHDocument;
  previewDispatch?: DocumentDispatch<any>;
  groupId?: string;
  formProps?: UseFormReturn & {
    triggerSubmit: () => void;
    formId: string;
  };
}

export function UiSchemaCustomCard({
  editing,
  component,
  previewDocument,
  previewDispatch,
  className,
  groupId,
  formProps,
}: UiSchemaCustomCardProps) {
  const customComponentConfig = component.config as CustomComponentConfig;

  const {
    CustomComponent,
    isLoadingCustomComponent,
    errorLoadingCustomComponent,
  } = useCustomComponent(customComponentConfig);

  const renderCustomComponent = () => {
    if (errorLoadingCustomComponent) {
      return (
        <div
          className={cn(
            "flex flex-col p-4 text-center text-(--secondary) border border-gray-200 bg-[#F9F9F9] rounded-md "
          )}
        >
          <span>
            Custom Component not found at path "./editors/custom-components/
            {customComponentConfig?.path}".
          </span>{" "}
          <span className="text-xs text-gray-500">
            Might need to refresh the page.
          </span>
        </div>
      );
    }

    if (isLoadingCustomComponent) {
      return (
        <div className="p-4 text-center text-(--secondary) border border-gray-200 bg-[#F9F9F9]">
          Custom Component is loading...
        </div>
      );
    }

    if (!CustomComponent) {
      return (
        <div className="p-4 text-center text-(--secondary) border border-gray-200 bg-[#F9F9F9]">
          Custom Component not available.
        </div>
      );
    }

    return (
      <CustomComponent
        name={customComponentConfig?.name || "Unnamed Custom Component"}
        path={customComponentConfig?.path || "custom-component.tsx"}
        document={previewDocument}
        dispatch={previewDispatch}
        formProps={formProps}
      />
    );
  };

  return (
    <UiSchemaWrapperCard
      editing={editing}
      component={component}
      className={className}
      groupId={groupId}
      WidgetIcon={CodeIcon}
      title={
        (component.config as CustomComponentConfig)?.name || "Custom Component"
      }
      SettingsContent={CustomSettingsContent}
    >
      <>{renderCustomComponent()}</>
    </UiSchemaWrapperCard>
  );
}

export default UiSchemaCustomCard;
