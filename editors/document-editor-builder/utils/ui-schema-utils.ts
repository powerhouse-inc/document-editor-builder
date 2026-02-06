import {
  AmountField,
  BooleanField,
  CurrencyCodeField,
  DatePickerField,
  DateTimePickerField,
  EmailField,
  EnumField,
  FileField,
  IdField,
  NumberField,
  OIDField,
  StringField,
} from "@powerhousedao/document-engineering/scalars";

import type {
  ActionComponentConfig,
  CallbackTrigger,
  ContentComponentConfig,
  EditorComponent,
  FieldDataType,
} from "../../../document-models/document-editor-builder/index.js";

export const checkIfActionInUISchema = (
  uischema: Array<EditorComponent>,
  actionId: string
) => {
  const count = uischema.filter(
    (component) =>
      component.type === "action" &&
      (component.config as ActionComponentConfig)?.action?.id === actionId
  );
  return {
    count: count.length,
    isAdded: count.length > 0,
  };
};

export const checkIfStateFieldInUISchema = (
  uischema: Array<EditorComponent>,
  scope: string
) => {
  const count = uischema.filter(
    (component) =>
      component.type === "content" &&
      (component.config as ContentComponentConfig)?.scope === scope
  );
  return {
    count: count.length,
    isAdded: count.length > 0,
  };
};

export const getDefaultCallbackTriggerForDataType = (
  dataType?: FieldDataType | null
): CallbackTrigger => {
  switch (dataType) {
    case "Boolean":
    case "Currency":
    case "Date":
    case "DateTime":
    case "Upload":
    case "Enum":
      return "onChange";
    default:
      return "onBlur";
  }
};

export const getScalarElementForDataType = (
  dataType: FieldDataType,
  showIdField?: boolean | null
) => {
  switch (dataType) {
    case "String":
      return StringField;
    case "Boolean":
      return BooleanField;
    case "Int":
    case "Float":
      return NumberField;
    case "Amount":
      return AmountField;
    case "Currency":
      return CurrencyCodeField;
    case "Date":
      return DatePickerField;
    case "DateTime":
      return DateTimePickerField;
    case "EmailAddress":
      return EmailField;
    case "OID":
      return showIdField ? OIDField : IdField;
    case "Upload":
      return FileField;
    case "Enum":
      return EnumField;
    default:
      return StringField;
  }
};

/**
 * Compares two values for equality, handling primitives, objects, arrays, etc.
 * Used to determine if a form field value has changed.
 */
export const valuesAreEqual = (val1: unknown, val2: unknown): boolean => {
  // Handle null/undefined cases
  if (val1 === null || val1 === undefined) {
    return val2 === null || val2 === undefined;
  }
  if (val2 === null || val2 === undefined) {
    return false;
  }

  // For primitives, use strict equality
  if (
    typeof val1 !== "object" ||
    typeof val2 !== "object" ||
    val1 instanceof Date ||
    val2 instanceof Date
  ) {
    return val1 === val2;
  }

  // For objects and arrays, use JSON.stringify for deep comparison
  try {
    return JSON.stringify(val1) === JSON.stringify(val2);
  } catch {
    // If JSON.stringify fails (e.g., circular references), fall back to strict equality
    return val1 === val2;
  }
};
