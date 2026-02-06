import { useSelectedDocumentEditorBuilderDocument } from "../../hooks/useDocumentEditorBuilderDocument.js";
import {
  Checkbox,
  NumberInput,
  TextInput,
} from "@powerhousedao/document-engineering";
import { useEffect, useState } from "react";
import type {
  ContentComponentConfig,
  ContentFormat,
  FieldDataType,
} from "../../../../document-models/document-editor-builder/index.js";
import { actions } from "../../../../document-models/document-editor-builder/index.js";
import type {
  ContentFormatInput,
} from "../../../../document-models/document-editor-builder/gen/schema/types.js";
import { Separator } from "../ui/separator.js";

interface ContentFormatSectionProps {
  componentId: string;
  component: ContentComponentConfig;
  dataType: FieldDataType;
}

type FormatValue = string | number | boolean | null | undefined;

/**
 * Get the current value of a format field from the contentFormat
 */
function getFormatValue(
  contentFormat: ContentFormat | null | undefined,
  fieldKey: string
): FormatValue {
  if (!contentFormat) return "";
  const format = contentFormat as Record<string, FormatValue>;
  return format[fieldKey] ?? "";
}

/**
 * Individual format input component with its own state
 */
function FormatInput({
  fieldKey,
  type,
  initialValue,
  onCommit,
}: {
  fieldKey: string;
  label: string;
  type: "String" | "Number" | "Boolean";
  initialValue: FormatValue;
  onCommit: (value: FormatValue) => void;
}) {
  const [value, setValue] = useState<FormatValue>(initialValue);

  // Sync with external changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleBlur = (newValue: FormatValue) => {
    if (newValue !== initialValue) {
      onCommit(newValue);
    }
  };

  const handleChange = (newValue: FormatValue) => {
    setValue(newValue);
    // For boolean values (checkboxes), commit immediately
    if (type === "Boolean") {
      onCommit(newValue);
    }
  };

  const commonProps = {
    name: `content-format-${fieldKey}`,
  };

  switch (type) {
    case "String":
      return (
        <TextInput
          {...commonProps}
          value={(value as string) ?? ""}
          onChange={(e) => setValue(e.target.value)}
          onBlur={(e) => handleBlur(e.target.value ?? null)}
        />
      );
    case "Number":
      return (
        <NumberInput
          {...commonProps}
          value={(value as number) ?? undefined}
          onChange={(e) =>
            setValue(e.target.value ? Number(e.target.value) : undefined)
          }
          onBlur={(e) =>
            handleBlur(e.target.value ? Number(e.target.value) : undefined)
          }
        />
      );
    case "Boolean":
      return (
        <Checkbox
          {...commonProps}
          value={(value as boolean) ?? false}
          onChange={handleChange}
        />
      );
  }
}

/**
 * Maps FieldDataType to the corresponding key in ContentFormatInput
 */
function mapDataTypeToContentFormatKey(
  dataType: FieldDataType
): keyof ContentFormatInput | null {
  switch (dataType) {
    case "Date":
    case "DateTime":
      return "date";
    case "Int":
      return "int";
    case "Float":
      return "float";
    case "Boolean":
      return "boolean";
    default:
      return null;
  }
}

export function ContentFormatSection({
  componentId,
  component,
  dataType,
}: ContentFormatSectionProps) {
  const [, dispatch] = useSelectedDocumentEditorBuilderDocument();

  // Map DataType to ContentFormat fields
  const getFormatFields = (): Array<{
    key: string;
    label: string;
    type: "String" | "Number" | "Boolean";
    description?: string;
  }> => {
    switch (dataType) {
      case "Date":
      case "DateTime":
        return [
          {
            key: "format",
            label: "Format",
            type: "String",
            description:
              "Uses date-fns format syntax (e.g., 'dd/MM/yyyy', 'MMM dd, yyyy')",
          },
        ];
      case "Int":
        return [{ key: "unit", label: "Unit", type: "String" }];
      case "Float":
        return [
          { key: "decimalPlaces", label: "Decimal Places", type: "Number" },
          { key: "unit", label: "Unit", type: "String" },
        ];
      case "Boolean":
        return [
          { key: "showCheckbox", label: "Show Checkbox", type: "Boolean" },
        ];
      default:
        return [];
    }
  };

  const formatFields = getFormatFields();

  const handleFormatCommit = (fieldKey: string, newValue: FormatValue) => {
    const key = mapDataTypeToContentFormatKey(dataType);
    if (!key) return;

    const formatUpdate = {
      [fieldKey]: newValue,
    };

    const contentFormatInput: Partial<ContentFormatInput> = {
      [key]: formatUpdate,
    };

    dispatch(
      actions.editContentComponent({
        id: componentId,
        contentFormat: contentFormatInput as ContentFormatInput,
      })
    );
  };

  if (formatFields.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <Separator className="bg-gray-200" />
      <div className="flex flex-wrap gap-4 max-w-[300px]">
        {formatFields.map((field) => (
          <div key={field.key} className="space-y-1 flex-1">
            <label className="text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <FormatInput
              fieldKey={field.key}
              label={field.label}
              type={field.type}
              initialValue={getFormatValue(component.contentFormat, field.key)}
              onCommit={(value) => handleFormatCommit(field.key, value)}
            />
            {field.description && (
              <p className="text-xs text-gray-500 mt-1">{field.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
