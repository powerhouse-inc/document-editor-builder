import { kebabCase } from "change-case";
import {
  allChildComponents,
  hasParentAction,
} from "../../../../editors/document-editor-builder/utils/component-utils.js";
import { Errors } from "../../../../editors/document-editor-builder/utils/errors.js";
import type {
  AddEditorActionFieldInput,
  ButtonFieldProps,
  ContentFormat,
  ContentFormatInput,
  EditEditorActionFieldInput,
} from "../../gen/schema/types.js";
import type {
  ActionComponentConfig,
  ButtonVariant,
  CallbackTrigger,
  ContentComponentConfig,
  CustomComponentConfig,
  EditorComponent,
  EditorComponentControl,
  EditorComponentType,
  FieldScalarProps,
  GroupComponentConfig,
  InputComponentConfig,
  ScopeType,
  SpacerComponentConfig,
} from "../../gen/types.js";
import { getDefaultCallbackTriggerForDataType } from "../../../../editors/document-editor-builder/utils/ui-schema-utils.js";
import type { DocumentEditorBuilderComponentsOperations } from "@powerhousedao/document-editor-builder/document-models/document-editor-builder";

// Helper function to map field scope to ScopeType
function mapScopeType(scope: string | null | undefined): ScopeType {
  if (scope === "not_binded") return "not_binded";
  if (scope === "default_value") return "default_value";
  if (scope === "submit_button") return "submit_button";
  if (scope === "reset_button") return "reset_button";
  return "binded";
}

// Helper function to find insertion index
function findInsertionIndex(
  schema: EditorComponent[],
  insertBefore: string | null | undefined,
): number {
  if (!insertBefore) return schema.length;
  const index = schema.findIndex((component) => component.id === insertBefore);
  return index === -1 ? schema.length : index;
}

// Helper function to create field component from field input data
// Handles both AddEditorActionFieldInput and EditEditorActionFieldInput
function createFieldComponent(
  field: AddEditorActionFieldInput | EditEditorActionFieldInput,
  actionId: string,
  groupId: string,
): EditorComponent {
  // Validate required fields for EditEditorActionFieldInput
  if (
    field.scope !== "submit_button" &&
    field.scope !== "reset_button" &&
    (!field.actionInput || !field.dataType)
  ) {
    throw Errors.validationError(
      `Field ${field.id} is missing required fields: actionInput and dataType`,
      "createFieldComponent",
    );
  }

  // Determine name: EditEditorActionFieldInput can have explicit name, otherwise use actionInput
  const name =
    "name" in field && field.name ? field.name : (field.actionInput ?? "");

  return {
    id: field.id,
    type: "input",
    config: {
      field: {
        name,
        actionInput: field.actionInput ?? null,
        scope: {
          type: mapScopeType(field.scope),
          field: field.scope ?? null,
          defaultValue: null,
        },
        dataType: field.dataType ?? null,
        props: null,
      },
      actionId,
    },
    groupId,
    control: "input",
  };
}

// Helper function to create action component
function createActionComponent(
  id: string,
  actionId: string,
  actionName: string,
  trigger: CallbackTrigger,
  hasResetButton: boolean = false,
): EditorComponent {
  return {
    id,
    type: "action",
    control: "form",
    config: {
      action: {
        id: actionId,
        name: actionName,
      },
      formProps: {
        trigger,
        hasResetButton,
      },
      group: {
        layout: "column",
        gap: 8,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        minWidth: null,
        maxWidth: null,
        minHeight: null,
        maxHeight: null,
        horizontalOrientation: null,
        verticalOrientation: null,
      },
    },
    groupId: null,
  };
}

// Helper function to update field component from edit input
function updateFieldComponent(
  existingField: EditorComponent,
  updatedField: EditEditorActionFieldInput,
): EditorComponent {
  const config = existingField.config as InputComponentConfig;
  const currentField = config.field;

  return {
    ...existingField,
    config: {
      ...config,
      field: {
        name: updatedField.name ?? currentField?.name ?? "",
        actionInput:
          updatedField.actionInput !== undefined
            ? (updatedField.actionInput ?? null)
            : (currentField?.actionInput ?? null),
        scope: {
          type: mapScopeType(updatedField.scope ?? currentField?.scope?.field),
          field: updatedField.scope ?? currentField?.scope?.field ?? null,
          defaultValue: currentField?.scope?.defaultValue ?? null,
        },
        dataType: updatedField.dataType ?? currentField?.dataType ?? null,
        props: currentField?.props ?? null,
      },
    },
  };
}

// Helper function to check if a field is a submit button field
function isSubmitButtonField(field: EditorComponent): boolean {
  if (field.type !== "input") return false;
  const config = field.config as InputComponentConfig;
  return config?.field?.scope?.type === ("submit_button" as ScopeType);
}

// Helper function to check if a field is a reset button field
function isResetButtonField(field: EditorComponent): boolean {
  if (field.type !== "input") return false;
  const config = field.config as InputComponentConfig;
  return config?.field?.scope?.type === ("reset_button" as ScopeType);
}

// Helper function to check if a field is any button field (submit or reset)
function isButtonField(field: EditorComponent): boolean {
  return isSubmitButtonField(field) || isResetButtonField(field);
}

// Helper function to create a submit button field component
function createSubmitButtonFieldComponent(
  id: string,
  actionId: string,
  groupId: string,
  buttonName: string = "Submit",
  buttonVariant: ButtonVariant = "default",
): EditorComponent {
  return {
    id,
    type: "input",
    config: {
      field: {
        name: buttonName,
        actionInput: "",
        scope: {
          type: "submit_button" as ScopeType,
          field: null,
          defaultValue: null,
        },
        dataType: null,
        props: {
          text: buttonName,
          variant: buttonVariant,
        } as ButtonFieldProps,
      },
      actionId,
    },
    groupId,
    control: "input",
  };
}

// Helper function to create a reset button field component
function createResetButtonFieldComponent(
  id: string,
  actionId: string,
  groupId: string,
  buttonName: string = "Reset",
  buttonVariant: ButtonVariant = "secondary",
): EditorComponent {
  return {
    id,
    type: "input",
    config: {
      field: {
        name: buttonName,
        actionInput: "",
        scope: {
          type: "reset_button" as ScopeType,
          field: null,
          defaultValue: null,
        },
        dataType: null,
        props: {
          text: buttonName,
          variant: buttonVariant,
        } as ButtonFieldProps,
      },
      actionId,
    },
    groupId,
    control: "input",
  };
}

// Helper function to find button field components within a form and nested groups
function findButtonFields(
  actionComponentId: string,
  schema: EditorComponent[],
  buttonType: "submit" | "reset",
): EditorComponent[] {
  const buttonFields: EditorComponent[] = [];
  const isButtonField =
    buttonType === "submit" ? isSubmitButtonField : isResetButtonField;

  // Recursive function to find button fields in nested groups
  function findInGroup(groupId: string | null) {
    schema.forEach((component) => {
      if (component.groupId === groupId) {
        if (isButtonField(component)) {
          buttonFields.push(component);
        } else if (component.type === "group") {
          // Recursively search in nested groups
          findInGroup(component.id);
        }
      }
    });
  }

  // Start searching from the action component's group
  findInGroup(actionComponentId);
  return buttonFields;
}

// Legacy function for backward compatibility
function findSubmitButtonFields(
  actionComponentId: string,
  schema: EditorComponent[],
): EditorComponent[] {
  return findButtonFields(actionComponentId, schema, "submit");
}

// Legacy function for backward compatibility
function findResetButtonFields(
  actionComponentId: string,
  schema: EditorComponent[],
): EditorComponent[] {
  return findButtonFields(actionComponentId, schema, "reset");
}

export const documentEditorBuilderComponentsOperations: DocumentEditorBuilderComponentsOperations =
  {
    addActionComponentOperation(state, action) {
      const { initialFields, id, actionId, actionName, trigger, insertBefore } =
        action.input;

      // Create field components
      const fieldComponents = initialFields.map((field) =>
        createFieldComponent(field, actionId, id),
      );

      // Find insertion index
      const insertionIndex = findInsertionIndex(state.schema, insertBefore);

      let newTrigger =
        trigger ??
        getDefaultCallbackTriggerForDataType(initialFields?.[0]?.dataType);
      if (newTrigger === "onChange") {
        if ((action.input.initialFields || [])?.length > 1) {
          newTrigger = "onBlur";
        } else {
          newTrigger = getDefaultCallbackTriggerForDataType(
            initialFields?.[0]?.dataType,
          );
        }
      }
      // Create action component (hasResetButton defaults to false for new actions)
      const actionComponent = createActionComponent(
        id,
        actionId,
        actionName,
        newTrigger,
        false,
      );

      // Insert action component first
      state.schema.splice(insertionIndex, 0, actionComponent);

      // Insert field components before the action component
      fieldComponents.forEach((fieldComponent, index) => {
        state.schema.splice(insertionIndex + index, 0, fieldComponent);
      });

      // If trigger is onSubmit, add submit button field component
      if (newTrigger === "onSubmit") {
        const buttonField = createSubmitButtonFieldComponent(
          "submit-button-" + id,
          actionId,
          id,
          "Submit",
          "default",
        );
        // Insert button field after all other fields
        const lastFieldIndex = insertionIndex + fieldComponents.length;
        state.schema.splice(lastFieldIndex, 0, buttonField);
      } else {
        // Remove all submit button fields when trigger is not onSubmit
        const existingSubmitButtonFields = findSubmitButtonFields(
          id,
          state.schema,
        );
        existingSubmitButtonFields.forEach((buttonField) => {
          state.schema = state.schema.filter((c) => c.id !== buttonField.id);
        });
      }
    },
    reorderComponentsOperation(state, action) {
      const reorderIndex = state.schema.findIndex(
        (component) => component.id === action.input.components[0],
      );

      const indexToInsert = findInsertionIndex(
        state.schema,
        action.input.insertBefore,
      );

      const reorderComponent = state.schema.splice(reorderIndex, 1);

      state.schema.splice(indexToInsert, 0, reorderComponent[0]);
    },
    removeComponentOperation(state, action) {
      const componentToRemove = state.schema.find(
        (component) => component.id === action.input.componentId,
      );
      if (!componentToRemove) {
        throw Errors.componentNotFound(
          action.input.componentId,
          "removeComponent",
        );
      }
      const childComponents = allChildComponents(
        componentToRemove,
        state.schema,
      ).map((c) => c.id);

      state.schema.forEach((component) => {
        if (component.groupId === action.input.componentId) {
          component.groupId = componentToRemove.groupId ?? null;
        }
      });

      // also remove inputs from the same action
      state.schema = state.schema.filter(
        (component) =>
          component.id !== action.input.componentId &&
          !(
            componentToRemove.type === "action" &&
            component.type === "input" &&
            childComponents.includes(component.id)
          ),
      );
    },
    editActionComponentOperation(state, action) {
      const {
        id,
        actionId,
        actionName,
        control,
        trigger,
        hasResetButton,
        fields: updatedFields,
      } = action.input;

      // Find the action component
      const actionComponent = state.schema.find(
        (component) => component.id === id,
      );

      if (!actionComponent) {
        throw Errors.componentNotFound(id, "editActionComponent");
      }

      if (actionComponent.control !== "form") {
        throw Errors.invalidComponentType(
          id,
          "form action component",
          actionComponent.control || "unknown",
          "editActionComponent",
        );
      }

      const childComponents = allChildComponents(actionComponent, state.schema);

      const config = actionComponent.config as ActionComponentConfig;
      const oldActionId = config.action?.id ?? "";
      const newActionId = actionId || oldActionId;
      const oldTrigger = config.formProps?.trigger ?? "onSubmit";

      // Check if trigger is being explicitly changed
      const isTriggerChanged = trigger !== undefined && trigger !== oldTrigger;
      let newTrigger = trigger ?? oldTrigger;

      const oldHasResetButton = config.formProps?.hasResetButton ?? false;
      const newHasResetButton = hasResetButton ?? oldHasResetButton;

      let newSchema = [...state.schema];

      // If actionId changed, delete all fields with the old actionId
      if (actionId && actionId !== oldActionId) {
        newSchema = newSchema.filter((component) => {
          if (
            childComponents.some((c) => c.id === component.id) &&
            component.type === "input" &&
            ((component.config as InputComponentConfig).actionId ===
              oldActionId ||
              component.groupId === actionComponent.id)
          ) {
            return false;
          }
          return true;
        });
      }

      // Process fields if provided
      if (updatedFields) {
        const newFieldIds = new Set(updatedFields.map((f) => f.id));

        // Get current existing fields (after potential deletion)
        const currentExistingFields = childComponents.filter(
          (component) =>
            component.type === "input" &&
            (component.config as InputComponentConfig).actionId === newActionId,
        );

        // Update or create fields
        updatedFields.forEach((updatedField) => {
          const existingField = currentExistingFields.find(
            (f) => f.id === updatedField.id,
          );
          if (existingField) {
            // Update existing field
            newSchema = newSchema.map((component) => {
              if (component.id === updatedField.id) {
                const updated = updateFieldComponent(component, updatedField);
                // Ensure actionId is up to date
                const fieldConfig = updated.config as InputComponentConfig;
                return {
                  ...updated,
                  config: {
                    ...fieldConfig,
                    actionId: newActionId,
                  },
                };
              }
              return component;
            });
          } else {
            // Create new field
            const newField = createFieldComponent(
              updatedField,
              newActionId,
              actionComponent.id,
            );
            // Find insertion point: after the action component or after last field
            const actionIndex = newSchema.findIndex((c) => c.id === id);
            const lastFieldIndex =
              currentExistingFields.length > 0
                ? newSchema.findIndex(
                    (c) =>
                      c.id ===
                      currentExistingFields[currentExistingFields.length - 1]
                        .id,
                  )
                : actionIndex;
            const insertIndex = lastFieldIndex + 1;
            newSchema.splice(insertIndex, 0, newField);
          }
        });

        // Remove fields that are no longer in the input (only if actionId didn't change)
        if (!actionId || actionId === oldActionId) {
          currentExistingFields.forEach((existingField) => {
            if (!newFieldIds.has(existingField.id)) {
              newSchema = newSchema.filter(
                (component) => component.id !== existingField.id,
              );
            }
          });
        }
      }

      // After processing fields, validate/adjust trigger based on final field state
      // Get all non-button fields after field processing
      const remainingNonButtonFields = newSchema.filter(
        (component) =>
          component.groupId === id &&
          component.type === "input" &&
          !isButtonField(component) &&
          (component.config as InputComponentConfig).actionId === newActionId,
      );

      // If trigger was changed to onChange, validate it against final field state
      if (isTriggerChanged && newTrigger === "onChange") {
        // onChange can only be used with exactly one field
        if (remainingNonButtonFields.length !== 1) {
          // More than one field or no fields - change to onBlur
          newTrigger = "onBlur";
        } else {
          // There's exactly one field, validate it's a valid type for onChange
          const singleField = remainingNonButtonFields[0];
          const fieldConfig = singleField.config as InputComponentConfig;
          const fieldDataType = fieldConfig?.field?.dataType;
          newTrigger = getDefaultCallbackTriggerForDataType(fieldDataType);
        }
      } else if (!isTriggerChanged && updatedFields !== undefined) {
        // If trigger was NOT explicitly changed, but we're editing fields,
        // check if we need to adjust the trigger based on remaining fields
        if (remainingNonButtonFields.length === 1) {
          // If there's only one field, adjust trigger based on that field's data type
          const singleField = remainingNonButtonFields[0];
          const fieldConfig = singleField.config as InputComponentConfig;
          const fieldDataType = fieldConfig?.field?.dataType;
          newTrigger = getDefaultCallbackTriggerForDataType(fieldDataType);
        } else if (remainingNonButtonFields.length > 1) {
          // If there's more than one field, change to onSubmit
          newTrigger = "onSubmit";
        }
      }

      // Update the action component with the final trigger
      newSchema = newSchema.map((component) => {
        if (component.id === id) {
          return {
            ...component,
            control:
              (control as EditorComponentControl | undefined) ??
              component.control,
            config: {
              ...config,
              action:
                actionId || actionName
                  ? {
                      id: newActionId,
                      name: actionName ?? config.action?.name ?? "",
                    }
                  : config.action,
              formProps: {
                ...(config.formProps || {}),
                trigger: newTrigger,
                hasResetButton: newHasResetButton,
              },
            },
          };
        }
        return component;
      });

      // Handle submit button field creation/removal based on final trigger
      const existingSubmitButtonFields = findSubmitButtonFields(id, newSchema);

      if (newTrigger === "onSubmit") {
        // Add submit button field if it doesn't exist
        if (existingSubmitButtonFields.length === 0) {
          const buttonField = createSubmitButtonFieldComponent(
            "submit-button-" + id,
            newActionId,
            id,
            "Submit Form",
            "default",
          );
          // Find insertion point: after the action component or after last field
          const actionIndex = newSchema.findIndex((c) => c.id === id);
          const childInputs = newSchema.filter(
            (c) => c.groupId === id && c.type === "input" && !isButtonField(c),
          );
          const insertIndex =
            childInputs.length > 0
              ? newSchema.findIndex(
                  (c) => c.id === childInputs[childInputs.length - 1].id,
                ) + 1
              : actionIndex + 1;
          newSchema.splice(insertIndex, 0, buttonField);
        }
      } else {
        // Remove all submit button fields when trigger is not onSubmit
        existingSubmitButtonFields.forEach((buttonField) => {
          newSchema = newSchema.filter((c) => c.id !== buttonField.id);
        });
      }

      // Handle reset button field creation/removal when hasResetButton changes
      const existingResetButtonFields = findResetButtonFields(id, newSchema);

      if (newHasResetButton) {
        // Add reset button field if it doesn't exist
        if (existingResetButtonFields.length === 0) {
          const resetButtonField = createResetButtonFieldComponent(
            "reset-button-" + id,
            newActionId,
            id,
            "Reset Form",
            "outline",
          );
          // Find insertion point: after the action component or after last field
          const actionIndex = newSchema.findIndex((c) => c.id === id);
          const childInputs = newSchema.filter(
            (c) => c.groupId === id && c.type === "input" && !isButtonField(c),
          );
          const insertIndex =
            childInputs.length > 0
              ? newSchema.findIndex(
                  (c) => c.id === childInputs[childInputs.length - 1].id,
                ) + 1
              : actionIndex + 1;
          newSchema.splice(insertIndex, 0, resetButtonField);
        }
      } else {
        // Remove all reset button fields when hasResetButton is false
        existingResetButtonFields.forEach((buttonField) => {
          newSchema = newSchema.filter((c) => c.id !== buttonField.id);
        });
      }

      state.schema = newSchema;
    },
    editFieldActionComponentOperation(state, action) {
      const updatedComponent = state.schema.find(
        (component) => component.id === action.input.fieldId,
      );

      if (!updatedComponent) {
        return;
      }

      const config = updatedComponent.config as InputComponentConfig;

      // Update the field component
      state.schema = state.schema.map((component) => {
        if (component.id !== action.input.fieldId) {
          return component;
        }
        const fieldConfig = component.config as InputComponentConfig;
        const currentField = fieldConfig?.field;
        const existingProps = currentField?.props as FieldScalarProps;

        // Merge input props with existing props using reduce
        const newProps = action.input.props
          ? Object.keys(action.input.props).reduce((acc, key) => {
              const inputValue =
                action.input.props?.[key as keyof FieldScalarProps];
              if (inputValue) {
                // Merge the input value object with existing props
                return {
                  ...(existingProps || {}),
                  ...(inputValue as FieldScalarProps),
                };
              }
              return acc;
            }, existingProps || {})
          : existingProps;

        return {
          ...component,
          config: {
            ...fieldConfig,
            field: {
              ...currentField,
              name: action.input.name ?? currentField?.name ?? null,
              scope: action.input.scopeType
                ? {
                    type: action.input.scopeType,
                    field: action.input.scopeField ?? null,
                    defaultValue: action.input.scopeDefaultValue ?? null,
                  }
                : currentField?.scope,
              props: newProps,
            },
          },
        };
      });
    },
    addComponentOperation(state, action) {
      const indexToInsert = findInsertionIndex(
        state.schema,
        action.input.insertBefore,
      );

      let newConfig;
      switch (action.input.type) {
        case "action":
          newConfig = {
            action: undefined,
            fields: [],
            formProps: {
              trigger: "onSubmit",
            },
            group: {
              layout: "column",
              gap: 8,
              paddingHorizontal: 0,
              paddingVertical: 0,
            },
          };
          break;
        case "content":
          newConfig = {
            label: null,
            scope: action.input.scope ?? null,
            scopeDataType: action.input.scopeDataType ?? null,
            text: null,
          };
          break;
        case "custom":
          newConfig = {
            name: action.input.name || "Custom Component",
            path: `${kebabCase(action.input.name || "custom-component")}.tsx`,
          };
          break;
        case "group":
          newConfig = {
            layout: "row",
            gap: 8,
            paddingHorizontal: 0,
            paddingVertical: 0,
          };
          break;
        case "spacer":
          newConfig = {
            width: null,
            height: null,
          };
          break;
        default:
          newConfig = {};
      }

      const newComponent = {
        id: action.input.id,
        type: action.input.type,
        control: action.input.control,
        config: newConfig,
        groupId: action.input.groupId ?? null,
      } as EditorComponent;

      state.schema.splice(indexToInsert, 0, newComponent);
    },
    editContentComponentOperation(state, action) {
      state.schema = state.schema.map((component) => {
        if (component.id !== action.input.id) {
          return component;
        }
        const config = component.config as ContentComponentConfig;
        const existingFormat = config?.contentFormat as ContentFormat;

        // Merge input contentFormat with existing format using reduce
        const newContentFormat = action.input.contentFormat
          ? Object.keys(action.input.contentFormat).reduce((acc, key) => {
              const inputValue =
                action.input.contentFormat?.[key as keyof ContentFormatInput];
              if (inputValue) {
                // Merge the input value object with existing format
                return {
                  ...(existingFormat || {}),
                  ...inputValue,
                };
              }
              return acc;
            }, existingFormat || {})
          : existingFormat;

        return {
          ...component,
          control: action.input.control ?? component.control,
          config: {
            ...config,
            scope:
              action.input.scope !== undefined
                ? action.input.scope
                : config?.scope,
            scopeDataType: action.input.scopeDataType ?? config?.scopeDataType,
            label: action.input.label ?? config?.label,
            text: action.input.text ?? config?.text,
            contentFormat: newContentFormat,
          },
        };
      });
    },
    editCustomComponentOperation(state, action) {
      state.schema = state.schema.map((component) =>
        component.id === action.input.id
          ? {
              ...component,
              config: {
                ...(component.config as CustomComponentConfig),
                name:
                  action.input.name ??
                  (component.config as CustomComponentConfig)?.name,
                path:
                  action.input.path ??
                  (component.config as CustomComponentConfig)?.path,
              },
            }
          : component,
      );
    },
    editSpacerComponentOperation(state, action) {
      state.schema = state.schema.map((component) =>
        component.id === action.input.id
          ? {
              ...component,
              config: {
                ...(component.config as SpacerComponentConfig),
                width:
                  action.input.width !== undefined
                    ? (action.input.width ?? null)
                    : ((component.config as SpacerComponentConfig)?.width ??
                      null),
                height:
                  action.input.height !== undefined
                    ? (action.input.height ?? null)
                    : ((component.config as SpacerComponentConfig)?.height ??
                      null),
              },
            }
          : component,
      );
    },
    createGroupOperation(state, action) {
      const indexToInsert = findInsertionIndex(
        state.schema,
        action.input.insertBefore,
      );

      const componentsToAdd = state.schema.filter((component) =>
        action.input.componentIds.includes(component.id),
      );

      const previousGroupId = componentsToAdd[0]?.groupId;

      componentsToAdd.forEach((component) => {
        component.groupId = action.input.id;
      });

      const newComponent = {
        id: action.input.id,
        type: "group" as EditorComponentType,
        control: "group" as EditorComponentControl,
        config: {
          layout: "row",
          gap: 8,
          paddingTop: 0,
          paddingRight: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          minWidth: null,
          maxWidth: null,
          minHeight: null,
          maxHeight: null,
          horizontalOrientation: null,
          verticalOrientation: null,
        } as GroupComponentConfig,
        groupId: previousGroupId,
      };
      const newSchema = [...state.schema];
      newSchema.splice(indexToInsert, 0, newComponent);
      state.schema = newSchema;
    },
    addToGroupOperation(state, action) {
      const groupComponent = state.schema.find(
        (component) => component.id === action.input.id,
      );
      if (!groupComponent) {
        throw Errors.groupNotFound(action.input.id, "addToGroup");
      }
      const insideAction =
        hasParentAction(groupComponent, state.schema) ||
        groupComponent.type === "action";
      const newSchema = [...state.schema];
      const newComponents = newSchema.filter((component) =>
        action.input.componentIds.includes(component.id),
      );

      if (insideAction && newComponents.some((c) => c.type === "action")) {
        throw Errors.invalidOperation(
          "Cannot add Action Components inside another Action Component",
          "addToGroup",
        );
      }
      newComponents.forEach((component) => {
        component.groupId = action.input.id;
      });
      state.schema = newSchema;
    },
    removeFromGroupOperation(state, action) {
      const groupComponent = state.schema.find(
        (component) => component.id === action.input.id,
      );

      if (!groupComponent) {
        throw Errors.groupNotFound(action.input.id, "removeFromGroup");
      }

      // Get components to remove
      const componentsToRemove = state.schema.filter((component) =>
        action.input.componentIds.includes(component.id),
      );

      // Check if removing from an action group
      const isActionGroup = groupComponent.type === "action";

      if (isActionGroup) {
        const actionConfig = groupComponent.config as ActionComponentConfig;
        const actionId = actionConfig.action?.id;

        if (actionId) {
          // Check each component being removed for nested inputs from this action
          for (const component of componentsToRemove) {
            // Get all nested children recursively
            const allChildren = allChildComponents(component, state.schema);

            // Check if component itself or any of its children is an input for this action
            const hasNestedInput =
              (component.type === "input" &&
                (component.config as InputComponentConfig).actionId ===
                  actionId) ||
              allChildren.some(
                (child) =>
                  child.type === "input" &&
                  (child.config as InputComponentConfig).actionId === actionId,
              );

            if (hasNestedInput) {
              throw Errors.invalidOperation(
                "Cannot remove a component with nested inputs from an action group",
                "removeFromGroup",
              );
            }
          }
        }
      }

      // first remove components from groupId to parent groupId if any
      const componentsInGroup = state.schema.filter(
        (component) => component.groupId === action.input.id,
      ).length;

      componentsToRemove.forEach((component) => {
        component.groupId = groupComponent?.groupId ?? null;
      });

      // then remove groupComponent if empty
      let newSchema = [...state.schema];
      newSchema = newSchema.filter(
        (component) =>
          !componentsToRemove.map((d) => d.id).includes(component.id),
      );
      const groupComponentIndex = newSchema.findIndex(
        (component) => component.id === action.input.id,
      );

      newSchema.splice(
        groupComponentIndex,
        componentsToRemove.length === componentsInGroup ? 1 : 0,
        ...componentsToRemove,
      );

      state.schema = newSchema;
    },
    editGroupComponentOperation(state, action) {
      state.schema = state.schema.map((component) => {
        const config =
          component.type === "group"
            ? (component.config as GroupComponentConfig)
            : (component.config as ActionComponentConfig).group;

        const newConfig = {
          ...config,
          layout:
            action.input.layout ??
            config?.layout ??
            (component.type === "action" ? "column" : "row"),
          gap: action.input.gap ?? config?.gap ?? 0,
          paddingTop: action.input.paddingTop ?? config?.paddingTop ?? 0,
          paddingRight: action.input.paddingRight ?? config?.paddingRight ?? 0,
          paddingBottom:
            action.input.paddingBottom ?? config?.paddingBottom ?? 0,
          paddingLeft: action.input.paddingLeft ?? config?.paddingLeft ?? 0,
          minWidth:
            action.input.minWidth !== undefined
              ? (action.input.minWidth ?? null)
              : (config?.minWidth ?? null),
          maxWidth:
            action.input.maxWidth !== undefined
              ? (action.input.maxWidth ?? null)
              : (config?.maxWidth ?? null),
          minHeight:
            action.input.minHeight !== undefined
              ? (action.input.minHeight ?? null)
              : (config?.minHeight ?? null),
          maxHeight:
            action.input.maxHeight !== undefined
              ? (action.input.maxHeight ?? null)
              : (config?.maxHeight ?? null),
          horizontalOrientation:
            action.input.horizontalOrientation ??
            config?.horizontalOrientation ??
            null,
          verticalOrientation:
            action.input.verticalOrientation ??
            config?.verticalOrientation ??
            null,
        };

        return component.id === action.input.id
          ? {
              ...component,
              config:
                component.type === "action"
                  ? {
                      ...(component.config as ActionComponentConfig),
                      group: newConfig,
                    }
                  : newConfig,
            }
          : component;
      });
    },
  };
