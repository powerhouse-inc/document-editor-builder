import {
  Checkbox,
  NumberInput,
  Select,
  TextInput,
} from "@powerhousedao/document-engineering";
import { useEffect, useMemo, useState } from "react";
import type { ZodTypeAny } from "zod";
import type {
  ButtonFieldPropsInput,
  ButtonVariant,
  FieldScalarPropsInput,
} from "../../../../document-models/document-editor-builder/gen/schema/types.js";
import {
  BooleanFieldPropsSchema,
  ButtonFieldPropsSchema,
  EnumFieldPropsSchema,
  NumberFieldPropsSchema,
  OidFieldPropsSchema,
  StringFieldPropsSchema,
} from "../../../../document-models/document-editor-builder/gen/schema/zod.js";
import {
  actions,
  type ActionField,
  type FieldDataType,
} from "../../../../document-models/document-editor-builder/index.js";
import { useSelectedDocumentEditorBuilderDocument } from "../../hooks/useDocumentEditorBuilderDocument.js";
import {
  extractPropsFromSchema,
  type PropDefinition,
} from "../../utils/parser-utils.js";
import { Separator } from "../ui/separator.js";

interface FieldPropsSectionProps {
  fieldId: string;
  field: ActionField;
  hideDivider?: boolean;
}

type PropValue = string | number | bigint | boolean | null | undefined;

/**
 * Label overrides for better UX
 */
const LABEL_OVERRIDES: Record<string, Record<string, string>> = {
  String: {},
  Number: {
    precision: "Precision",
  },
  Boolean: {},
  OID: {
    showIdField: "Manually insert UUID Field",
  },
  Enum: {},
};

/**
 * Dynamically build the field props map from Zod schemas
 */
function buildFieldPropsMap(): Record<FieldDataType, PropDefinition[]> {
  // Call schema functions and cast to proper type
  const stringSchema = StringFieldPropsSchema();
  const numberSchema = NumberFieldPropsSchema();
  const booleanSchema = BooleanFieldPropsSchema();
  const oidSchema = OidFieldPropsSchema();
  const enumSchema = EnumFieldPropsSchema();

  const stringProps = extractPropsFromSchema(
    stringSchema as ZodTypeAny,
    LABEL_OVERRIDES.String
  );
  const numberProps = extractPropsFromSchema(
    numberSchema as ZodTypeAny,
    LABEL_OVERRIDES.Number
  );
  const booleanProps = extractPropsFromSchema(
    booleanSchema as ZodTypeAny,
    LABEL_OVERRIDES.Boolean
  );
  const oidProps = extractPropsFromSchema(
    oidSchema as ZodTypeAny,
    LABEL_OVERRIDES.OID
  );
  const enumProps = extractPropsFromSchema(
    enumSchema as ZodTypeAny,
    LABEL_OVERRIDES.Enum
  );

  return {
    String: stringProps,
    Boolean: booleanProps,
    Amount: [],
    Date: [],
    DateTime: [],
    EmailAddress: [],
    OID: oidProps,
    Upload: [],
    Int: numberProps,
    Currency: [],
    Float: numberProps,
    Enum: enumProps,
  };
}

/**
 * Map of field component types to their available props (built dynamically)
 */
const FIELD_PROPS_MAP = buildFieldPropsMap();

/**
 * Get the current value of a prop from the field
 */
function getPropValue(field: ActionField, propKey: string): PropValue {
  const props = field.props as Record<string, PropValue> | null | undefined;
  if (field.scope?.type === "submit_button" && propKey === "variant") {
    return props?.[propKey] ?? "default";
  }
  return props?.[propKey] ?? (propKey === "text" ? "" : null);
}

/**
 * Individual prop input component with its own state
 */
function PropInput({
  propDef,
  initialValue,
  onCommit,
}: {
  propDef: PropDefinition;
  initialValue: PropValue;
  onCommit: (value: PropValue) => void;
}) {
  const [value, setValue] = useState<PropValue>(initialValue);

  // Sync with external changes (e.g., when field changes)
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleBlur = (newValue: PropValue) => {
    // Only commit if value actually changed from initial
    if (newValue !== initialValue) {
      onCommit(newValue);
    }
  };

  const handleChange = (newValue: PropValue) => {
    setValue(newValue);
    // For boolean values (checkboxes), commit immediately
    if (propDef.type === "Boolean" || propDef.type === "Enum") {
      onCommit(newValue);
    }
  };

  const commonProps = {
    name: `field-prop-${propDef.key}`,
  };

  switch (propDef.type) {
    case "String":
      return (
        <TextInput
          {...commonProps}
          value={(value as string) ?? ""}
          onChange={(e) => setValue(e.target.value)}
          onBlur={(e) => handleBlur(e.target.value ?? null)}
        />
      );
    case "Enum":
      return (
        <Select
          {...commonProps}
          options={
            propDef.enumOptions?.map((opt) => ({
              label: opt,
              value: opt,
            })) || []
          }
          value={
            (value as string) ?? (propDef.key === "variant" ? "default" : "")
          }
          placeholder="Select an option"
          multiple={false}
          clearable={propDef.key !== "variant"}
          onChange={(newValue) => handleChange(newValue as string)}
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

const PROP_ORDER = [
  "text",
  "variant",
  "placeholder",
  "precision",
  "description",
  "minLength",
  "maxLength",
  "min",
  "max",
  "multiline",
  "isToggle",
  "optionalLabel",
  "clearable",
  "searchable",
];

/**
 * Maps FieldDataType to the corresponding key in FieldScalarPropsInput
 */
function mapFieldDataTypeToKey(
  dataType: FieldDataType
): keyof FieldScalarPropsInput | null {
  switch (dataType) {
    case "String":
      return "string";
    case "Boolean":
      return "boolean";
    case "Int":
    case "Float":
    case "Amount":
    case "Currency":
      return "number";
    case "OID":
      return "oid";
    case "Enum":
      return "enum";
    default:
      return null;
  }
}

export function FieldPropsSection({
  fieldId,
  field,
  hideDivider,
}: FieldPropsSectionProps) {
  const [, dispatch] = useSelectedDocumentEditorBuilderDocument();

  const isButtonField =
    field.scope?.type === "submit_button" ||
    field.scope?.type === "reset_button";

  // For button fields, use ButtonFieldPropsSchema
  const buttonProps = useMemo(() => {
    if (!isButtonField) return [];
    const buttonSchema = ButtonFieldPropsSchema();
    return extractPropsFromSchema(buttonSchema as ZodTypeAny, {
      text: "Button Text",
      variant: "Button Variant",
    });
  }, [isButtonField]);

  const availableProps = isButtonField
    ? buttonProps
    : FIELD_PROPS_MAP[field.dataType || "String"] || [];

  const handlePropCommit = (propKey: string, newValue: PropValue) => {
    if (isButtonField) {
      // Handle button field props - preserve existing values when updating one
      const currentProps =
        (field.props as
          | { text?: string; variant?: string }
          | null
          | undefined) || {};
      const buttonPropsUpdate: ButtonFieldPropsInput = {
        text:
          propKey === "text"
            ? ((newValue as string | null) ?? null)
            : (currentProps.text ?? null),
        variant:
          propKey === "variant"
            ? (newValue as ButtonVariant)
            : ((currentProps.variant ?? "default") as ButtonVariant),
      };

      const fieldScalarPropsInput: Partial<FieldScalarPropsInput> = {
        button: buttonPropsUpdate,
      };

      dispatch(
        actions.editFieldActionComponent({
          fieldId: fieldId,
          props: fieldScalarPropsInput,
        })
      );
    } else {
      // Handle regular field props
      const key = mapFieldDataTypeToKey(field.dataType!);
      if (!key) return;

      const propsUpdate = {
        [propKey]: newValue,
      };

      const fieldScalarPropsInput: Partial<FieldScalarPropsInput> = {
        [key]: propsUpdate,
      };

      dispatch(
        actions.editFieldActionComponent({
          fieldId: fieldId,
          props: fieldScalarPropsInput,
        })
      );
    }
  };

  if (availableProps.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {!hideDivider && <Separator className="bg-gray-200" />}
      {availableProps
        .sort((a, b) => PROP_ORDER.indexOf(a.key) - PROP_ORDER.indexOf(b.key))
        .map((propDef) => (
          <div key={propDef.key} className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              {propDef.label}
            </label>
            <PropInput
              propDef={propDef}
              initialValue={getPropValue(field, propDef.key)}
              onCommit={(value) => handlePropCommit(propDef.key, value)}
            />
          </div>
        ))}
    </div>
  );
}
