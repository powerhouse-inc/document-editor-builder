import { Button } from "@powerhousedao/document-engineering";
import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import type { PHDocument } from "document-model";
import type { ReactNode } from "react";
import type { UseFormReturn } from "@powerhousedao/document-editor-builder/components";
import type {
  EditorComponent,
  InputComponentConfig,
} from "@powerhousedao/document-editor-builder/document-models/document-editor-builder";
import { actions } from "@powerhousedao/document-editor-builder/document-models/document-editor-builder";
import { allChildComponents, hasParentAction } from "./component-utils.js";
import UiSchemaActionCard from "../components/ui-schema-parser/action-component/ui-schema-action-card.js";
import UiSchemaField from "../components/ui-schema-parser/action-component/ui-schema-field.js";
import UiSchemaContentCard from "../components/ui-schema-parser/content-component/ui-schema-content-card.js";
import UiSchemaCustomCard from "../components/ui-schema-parser/custom-component/ui-schema-custom-card.js";
import UiSchemaGroupCard from "../components/ui-schema-parser/group-component/ui-schema-group-card.js";
import { UiSchemaSpacerCard } from "../components/ui-schema-parser/spacer-component/ui-schema-spacer-card.js";

// Re-export for backward compatibility
export { allChildComponents, hasParentAction };

export interface ComponentRendererProps {
  childComponent: EditorComponent;
  editing: boolean;
  previewDocument?: PHDocument;
  previewDispatch?: DocumentDispatch<any>;
  documentType?: string;
  groupId?: string;
  schemaComponents?: Array<EditorComponent>;
  documentBuilderDispatch?: DocumentDispatch<any>;
  className?: string;
  // Form props (optional, only needed for input rendering)
  formProps?: UseFormReturn & {
    triggerSubmit: () => void;
    resetForm?: () => void;
    formId: string;
  };
  optionalFieldsMap?: Map<string, boolean>;
  enumOptionsMap?: Map<string, string[]>;
  formTrigger?: "onSubmit" | "onChange" | "onBlur";
}

/**
 * Shared component renderer that can be used in both group-card and action-form-card
 */
export function renderComponent({
  childComponent,
  editing,
  previewDocument,
  previewDispatch,
  documentType,
  groupId,
  schemaComponents,
  documentBuilderDispatch,
  className = "flex-1 min-w-[180px]",
  formProps,
  optionalFieldsMap,
  enumOptionsMap,
  formTrigger,
}: ComponentRendererProps): ReactNode {
  switch (childComponent.type) {
    case "action":
      return (
        <UiSchemaActionCard
          key={childComponent.id}
          editing={editing}
          previewDocument={previewDocument}
          previewDispatch={previewDispatch}
          component={childComponent}
          className={className}
          groupId={groupId}
          documentType={documentType}
          childComponents={
            schemaComponents?.filter((c) => c.groupId === childComponent.id) ||
            []
          }
          schemaComponents={schemaComponents}
          documentBuilderDispatch={documentBuilderDispatch}
          renderComponent={renderComponent}
        />
      );
    case "content":
      return (
        <UiSchemaContentCard
          key={childComponent.id}
          editing={editing}
          previewDocument={previewDocument}
          component={childComponent}
          className={className}
          groupId={groupId}
        />
      );
    case "custom":
      return (
        <UiSchemaCustomCard
          key={childComponent.id}
          editing={editing}
          previewDocument={previewDocument}
          previewDispatch={previewDispatch}
          component={childComponent}
          className={className}
          groupId={groupId}
          formProps={formProps}
        />
      );
    case "group":
      return (
        <UiSchemaGroupCard
          key={childComponent.id}
          editing={editing}
          component={childComponent}
          previewDocument={previewDocument}
          previewDispatch={previewDispatch}
          className={className}
          groupId={groupId}
          documentType={documentType}
          childComponents={
            schemaComponents?.filter((c) => c.groupId === childComponent.id) ||
            []
          }
          schemaComponents={schemaComponents}
          documentBuilderDispatch={documentBuilderDispatch}
          formProps={formProps}
          optionalFieldsMap={optionalFieldsMap}
          enumOptionsMap={enumOptionsMap}
          formTrigger={formTrigger}
          renderComponent={renderComponent}
        />
      );
    case "spacer":
      return (
        <UiSchemaSpacerCard
          key={childComponent.id}
          editing={editing}
          component={childComponent}
          className={className}
          groupId={groupId}
        />
      );
    case "input": {
      // Only render input if hasParentAction is true
      const componentHasParentAction = hasParentAction(
        childComponent,
        schemaComponents
      );

      if (!componentHasParentAction) {
        return null;
      }

      const inputConfig = childComponent.config as InputComponentConfig;
      const fieldName = inputConfig?.field?.actionInput;
      const isButtonField =
        inputConfig?.field?.scope?.type === "submit_button" ||
        inputConfig?.field?.scope?.type === "reset_button";

      // Button fields need form props for reset functionality
      if (isButtonField) {
        return (
          <UiSchemaField
            key={childComponent.id}
            editing={editing}
            component={childComponent}
            formProps={formProps}
          />
        );
      }

      // Render input component with form props
      if (!formProps || !optionalFieldsMap) {
        // If form props is not available, we can't render the input properly
        return null;
      }

      const {
        formState: { errors, touchedFields },
        triggerSubmit,
      } = formProps;

      if (!fieldName) {
        return null;
      }

      const isInvalid: boolean =
        !!touchedFields[fieldName] && !!errors[fieldName];

      const isOptional = optionalFieldsMap.get(fieldName);
      const options = enumOptionsMap?.get(fieldName);

      return (
        <UiSchemaField
          key={childComponent.id}
          editing={editing}
          component={childComponent}
          isInvalid={isInvalid}
          isOptional={isOptional}
          options={options}
          fieldName={fieldName}
          formProps={formProps}
          onBlur={formTrigger === "onBlur" ? triggerSubmit : undefined}
          onChange={formTrigger === "onChange" ? triggerSubmit : undefined}
        />
      );
    }
    default: {
      // TODO: Add component for table
      return (
        <div key={childComponent.id}>
          Component card for {childComponent.type}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              documentBuilderDispatch?.(
                actions.removeComponent({ componentId: childComponent.id })
              );
            }}
          >
            Remove
          </Button>
        </div>
      );
    }
  }
}
