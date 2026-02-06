import type { PHBaseState, PHDocument } from "document-model";
import {
  EyeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ListIcon,
  PilcrowIcon,
  Square,
  SquareCheckBig,
  SquareDashed,
  TypeIcon,
} from "lucide-react";
import { useMemo, type HTMLAttributes } from "react";
import {
  type BooleanFormat,
  type ContentComponentConfig,
  type DateFormat,
  type EditorComponent,
  type FloatFormat,
  type IntFormat,
} from "../../../../../document-models/document-editor-builder/index.js";
import { cn } from "../../../lib/utils.js";
import { interpolateVariables } from "../../../utils/variable-interpolation.js";
import { ContentSettingsContent } from "../../component-settings/ContentSettingsContent.js";
import UiSchemaWrapperCard from "../ui-schema-wrapper-card.js";
import {
  ContentCardBulletListControl,
  ContentCardLabelControl,
  ContentCardParagraphControl,
  ContentCardSubtitleControl,
  ContentCardTitleControl,
} from "./content-card-controls.js";
import { format } from "date-fns";

interface DocumentState extends PHBaseState {
  global: {
    [key: string]: string | number | boolean;
  };
}

interface UiSchemaContentCardProps extends HTMLAttributes<HTMLDivElement> {
  editing: boolean;
  component: EditorComponent;
  previewDocument?: PHDocument;
  groupId?: string;
}

export const ControlMap = {
  title: { icon: Heading1Icon, label: "Title" },
  subtitle: { icon: Heading2Icon, label: "Subtitle" },
  label: { icon: Heading3Icon, label: "Label" },
  paragraph: { icon: PilcrowIcon, label: "Paragraph" },
  bulletList: { icon: ListIcon, label: "Bullet List" },
};

export function UiSchemaContentCard({
  editing,
  component,
  previewDocument,
  className,
  groupId,
}: UiSchemaContentCardProps) {
  const isState = useMemo(() => {
    return (component.config as ContentComponentConfig)?.scope !== null;
  }, [component.config]);

  const contentValue = useMemo(() => {
    if (isState) {
      return (previewDocument?.state as DocumentState)?.global[
        (component.config as ContentComponentConfig)?.scope ?? ""
      ];
    }

    // For static content, interpolate variables using ${variableName} syntax
    const staticText = (component.config as ContentComponentConfig)?.text ?? "";
    const documentState = (previewDocument?.state as DocumentState)?.global;
    return interpolateVariables(staticText, documentState);
  }, [
    (previewDocument?.state as DocumentState)?.global,
    component.config,
    isState,
  ]);

  const formattedContentValue = useMemo(() => {
    if (
      Array.isArray(contentValue) ||
      contentValue === null ||
      contentValue === undefined
    ) {
      return "";
    }

    const contentFormat = (component.config as ContentComponentConfig)
      ?.contentFormat;

    const dataType = (component.config as ContentComponentConfig)
      ?.scopeDataType;
    if (!dataType) {
      const isObject = typeof contentValue === "object";
      const value = isObject ? JSON.stringify(contentValue) : contentValue;
      return value?.toString();
    }
    try {
      switch (dataType) {
        case "Float": {
          let decimalPlaces = Number(
            (contentFormat as FloatFormat)?.decimalPlaces
          );

          if (
            (contentFormat as FloatFormat).decimalPlaces === null ||
            isNaN(decimalPlaces)
          ) {
            decimalPlaces = 2;
          }
          const unit = (contentFormat as FloatFormat)?.unit;
          return `${Number(contentValue).toFixed(
            decimalPlaces
          )}${unit ? ` ${unit}` : ""}`;
        }
        case "Int": {
          const unit = (contentFormat as IntFormat)?.unit;
          return `${contentValue}${unit ? ` ${unit}` : ""}`;
        }
        case "Date": {
          const formatString = (contentFormat as DateFormat)?.format;
          return formatString
            ? format(new Date(contentValue as string), formatString)
            : new Date(contentValue as string).toLocaleDateString();
        }
        case "DateTime": {
          const formatString = (contentFormat as DateFormat)?.format;
          return formatString
            ? format(new Date(contentValue as string), formatString)
            : new Date(contentValue as string).toLocaleString();
        }
        case "Boolean": {
          const showCheckbox = (contentFormat as BooleanFormat)?.showCheckbox;
          return showCheckbox ? (
            contentValue === null || contentValue === undefined ? (
              <SquareDashed />
            ) : contentValue ? (
              <SquareCheckBig />
            ) : (
              <Square />
            )
          ) : contentValue ? (
            "Yes"
          ) : (
            "No"
          );
        }
      }

      return contentValue.toString();
    } catch (error) {
      console.error(error);
      return contentValue.toString();
    }
  }, [component.config, contentValue]);

  const renderControl = () => {
    const config = component.config as ContentComponentConfig;
    switch (component.control) {
      case "bulletList":
        return (
          <ContentCardBulletListControl
            value={
              Array.isArray(contentValue)
                ? contentValue
                : ((contentValue || "") as string)
                    .split(";")
                    .map((item) => item.trim())
                    .filter((item) => item !== "")
            }
            label={isState ? (config?.label ?? "") : undefined}
          />
        );
      case "title":
        return (
          <ContentCardTitleControl
            value={formattedContentValue ?? ""}
            label={isState ? (config?.label ?? "") : undefined}
          />
        );
      case "subtitle":
        return (
          <ContentCardSubtitleControl
            value={formattedContentValue ?? ""}
            label={isState ? (config?.label ?? "") : undefined}
          />
        );
      case "label":
        return (
          <ContentCardLabelControl
            value={formattedContentValue ?? ""}
            label={isState ? (config?.label ?? "") : undefined}
          />
        );
      case "paragraph":
      default:
        return (
          <ContentCardParagraphControl
            value={formattedContentValue ?? ""}
            label={isState ? (config?.label ?? "") : undefined}
          />
        );
    }
  };

  return (
    <UiSchemaWrapperCard
      editing={editing}
      component={component}
      className={className}
      groupId={groupId}
      WidgetIcon={
        isState
          ? EyeIcon
          : ControlMap[component.control as keyof typeof ControlMap]?.icon ||
            TypeIcon
      }
      title={
        isState
          ? (component.config as ContentComponentConfig)?.scope || "State Text"
          : ControlMap[component.control as keyof typeof ControlMap]?.label ||
            "Text Content"
      }
      SettingsContent={ContentSettingsContent}
    >
      <div
        className={cn(
          "flex flex-col gap-4 min-h-6",
          editing ? "px-3 pb-3 pt-6" : ""
        )}
      >
        <div className="text-sm text-gray-500">{renderControl()}</div>
      </div>
    </UiSchemaWrapperCard>
  );
}

export default UiSchemaContentCard;
