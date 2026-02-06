import { TextCursorInputIcon } from "lucide-react";
import { useCallback, useMemo, useRef } from "react";
import { Button } from "@powerhousedao/document-engineering";
import type { UseFormReturn } from "@powerhousedao/document-editor-builder/components";
import type {
  EditorComponent,
  InputComponentConfig,
  ButtonVariant,
} from "../../../../../document-models/document-editor-builder/index.js";
import { type OidFieldProps } from "../../../../../document-models/document-editor-builder/index.js";
import { cn } from "../../../lib/utils.js";
import {
  getScalarElementForDataType,
  valuesAreEqual,
} from "../../../utils/ui-schema-utils.js";
import FieldSettings from "../../field-settings/FieldSettings.js";
import { Field } from "../../ui/field.js";
import UiSchemaWrapperCard from "../ui-schema-wrapper-card.js";
interface IProps {
  component: EditorComponent;
  isInvalid?: boolean;
  isOptional?: boolean;
  editing: boolean;
  options?: string[];
  fieldName?: string;
  formProps?: UseFormReturn & {
    triggerSubmit?: () => void;
    resetForm?: () => void;
    formId?: string;
  };
  onBlur?: () => void;
  onChange?: () => void;
}

export default function UiSchemaField({
  component,
  isInvalid,
  isOptional,
  editing,
  options,
  fieldName,
  formProps,
  onBlur,
  onChange,
}: IProps) {
  const field = useMemo(() => {
    return (component.config as InputComponentConfig)?.field;
  }, [component]);

  // Track the value when the field gets focus
  const valueOnFocusRef = useRef<string | number | boolean | null | undefined>(
    undefined
  );

  const handleFocus = useCallback(() => {
    if (!formProps || !fieldName) {
      return;
    }
    const currentValue = formProps.getValues(fieldName) as
      | string
      | number
      | boolean
      | null
      | undefined;
    valueOnFocusRef.current = currentValue;
  }, [formProps, fieldName]);

  // Create a conditional onBlur handler that only triggers if value changed from focus
  const handleBlur = useCallback(() => {
    if (!onBlur || !formProps || !fieldName) {
      return onBlur?.();
    }

    const currentValue = formProps.getValues(fieldName) as
      | string
      | number
      | boolean
      | null
      | undefined;
    const valueOnFocus = valueOnFocusRef.current;

    // Only trigger onBlur if the value actually changed from when focus was gained
    // This ensures we don't trigger if the user just focused and blurred without changing anything
    if (!valuesAreEqual(currentValue, valueOnFocus)) {
      onBlur();
    }
  }, [onBlur, formProps, fieldName]);

  const isButtonField =
    field.scope?.type === "submit_button" ||
    (field.scope?.type as string) === "reset_button";

  // Render button field as a button
  if (isButtonField) {
    const isSubmitButton = field.scope?.type === "submit_button";
    const buttonProps = isButtonField
      ? (field.props as { text?: string; variant?: ButtonVariant } | null)
      : null;
    return (
      <UiSchemaWrapperCard
        editing={editing}
        component={component}
        groupId={component?.groupId || undefined}
        WidgetIcon={TextCursorInputIcon}
        title={
          field.name || (isSubmitButton ? "Submit Button" : "Reset Button")
        }
        SettingsContent={FieldSettings}
        className="flex-1 min-w-[180px]"
      >
        <div
          className={cn(
            "flex flex-col gap-4 min-h-6 w-full",
            editing ? "px-3 pb-3 pt-6" : ""
          )}
        >
          <Button
            type={isSubmitButton ? "submit" : "button"}
            variant={
              buttonProps?.variant ?? (isSubmitButton ? "default" : "outline")
            }
            onClick={
              !isSubmitButton && formProps?.resetForm
                ? formProps.resetForm
                : undefined
            }
          >
            {buttonProps?.text ?? (isSubmitButton ? "Submit" : "Reset")}
          </Button>
        </div>
      </UiSchemaWrapperCard>
    );
  }

  const SchemaUiElement: any = getScalarElementForDataType(
    field.dataType!,
    (field.props as OidFieldProps)?.showIdField
  );
  const isHiddenIdField =
    field.dataType === "OID" && !(field.props as OidFieldProps)?.showIdField;

  return (
    <UiSchemaWrapperCard
      editing={editing}
      component={component}
      groupId={component?.groupId || undefined}
      WidgetIcon={TextCursorInputIcon}
      title={field.actionInput || field.name || "Field"}
      SettingsContent={FieldSettings}
      className={cn(
        "flex-1 min-w-[180px]",
        !editing && isHiddenIdField && "hidden"
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-4 min-h-6 w-full",
          editing ? "px-3 pb-3 pt-6" : ""
        )}
      >
        <Field data-invalid={isInvalid}>
          <SchemaUiElement
            label={field.name ?? ""}
            name={field.actionInput}
            required={!isOptional}
            variant={field.dataType === "Enum" ? "auto" : undefined}
            options={options?.map((option) => ({
              value: option,
              label: capitalize(option),
            }))}
            {...(field.props
              ? Object.fromEntries(
                  Object.entries(field.props).map(([key, value]) => [
                    key,
                    value === null ? undefined : value,
                  ])
                )
              : {})}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={onChange}
            className="w-full"
          />
          {editing && isHiddenIdField && (
            <span className="text-xs text-gray-500">
              This field is not visible in the document and will be used as a
              unique identifier.
            </span>
          )}
        </Field>
      </div>
    </UiSchemaWrapperCard>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
