import { describe, expect, it } from "vitest";
import {
  reducer,
  utils,
  isDocumentEditorBuilderDocument,
  addActionComponent,
  reorderComponents,
  removeComponent,
  editActionComponent,
  editFieldActionComponent,
  addComponent,
  editContentComponent,
  editCustomComponent,
  createGroup,
  addToGroup,
  removeFromGroup,
  editGroupComponent,
  editSpacerComponent,
  type ActionComponentConfig,
  type AddActionComponentInput,
  type AddComponentInput,
  type AddToGroupInput,
  type CallbackTrigger,
  type ContentComponentConfig,
  type CreateGroupInput,
  type CustomComponentConfig,
  type EditActionComponentInput,
  type EditContentComponentInput,
  type EditCustomComponentInput,
  type EditFieldActionComponentInput,
  type EditGroupComponentInput,
  type EditSpacerComponentInput,
  type EditorComponent,
  type EditorComponentControl,
  type EditorComponentType,
  type FieldDataType,
  type GroupComponentConfig,
  type HorizontalOrientation,
  type InputComponentConfig,
  type Layout,
  type RemoveFromGroupInput,
  type ScopeType,
  type SpacerComponentConfig,
  type VerticalOrientation,
} from "@powerhousedao/document-editor-builder/document-models/document-editor-builder";

const createCustomComponent = (
  id: string,
  groupId: string | null = null,
): EditorComponent => ({
  id,
  type: "custom" as EditorComponentType,
  control: "custom" as EditorComponentControl,
  config: {
    name: "Custom Component",
    path: "custom-component.tsx",
  } as CustomComponentConfig,
  groupId,
});

export const createSpacerComponent = (
  id: string,
  groupId: string | null = null,
): EditorComponent => ({
  id,
  type: "spacer" as EditorComponentType,
  control: "spacer" as EditorComponentControl,
  config: {
    width: null,
    height: null,
  } as SpacerComponentConfig,
  groupId,
});

export const createContentComponent = (
  id: string,
  groupId: string | null = null,
): EditorComponent => ({
  id,
  type: "content" as EditorComponentType,
  control: "paragraph" as EditorComponentControl,
  config: {
    label: null,
    scope: null,
    scopeDataType: null,
    text: null,
    contentFormat: null,
  } as ContentComponentConfig,
  groupId,
});

const createActionComponent = (
  id: string,
  actionId: string,
): EditorComponent => ({
  id,
  type: "action" as EditorComponentType,
  control: "form" as EditorComponentControl,
  config: {
    action: {
      id: actionId,
      name: "Action",
    },
    formProps: {
      trigger: "onBlur" as CallbackTrigger,
      hasResetButton: false,
    },
    group: {
      layout: "column" as Layout,
      gap: 8,
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      minWidth: null,
      maxWidth: null,
      minHeight: null,
      maxHeight: null,
      horizontalOrientation: null as HorizontalOrientation | null,
      verticalOrientation: null as VerticalOrientation | null,
    },
  } as ActionComponentConfig,
  groupId: null,
});

const createInputComponent = (
  id: string,
  actionId: string,
  groupId: string | null,
): EditorComponent => ({
  id,
  type: "input" as EditorComponentType,
  control: "input" as EditorComponentControl,
  config: {
    field: {
      name: "Field",
      actionInput: "name",
      scope: {
        type: "binded" as ScopeType,
        field: "name",
        defaultValue: null,
      },
      dataType: "String" as FieldDataType,
      props: null,
    },
    actionId,
  } as InputComponentConfig,
  groupId,
});

const createGroupComponent = (
  id: string,
  groupId: string | null = null,
): EditorComponent => ({
  id,
  type: "group" as EditorComponentType,
  control: "group" as EditorComponentControl,
  config: {
    layout: "row" as Layout,
    gap: 8,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    minWidth: null,
    maxWidth: null,
    minHeight: null,
    maxHeight: null,
    horizontalOrientation: null as HorizontalOrientation | null,
    verticalOrientation: null as VerticalOrientation | null,
  } as GroupComponentConfig,
  groupId,
});

describe("ComponentsOperations", () => {
  it("should handle addActionComponent operation", () => {
    const document = utils.createDocument();
    const input: AddActionComponentInput = {
      id: "action-1",
      actionId: "action-1",
      actionName: "Action",
      trigger: "onBlur",
      control: "form",
      initialFields: [
        {
          id: "field-1",
          actionInput: "name",
          scope: "name",
          dataType: "String",
        },
      ],
      insertBefore: null,
    };

    const updatedDocument = reducer(document, addActionComponent(input));
    const schema = updatedDocument.state.global.schema;

    expect(isDocumentEditorBuilderDocument(updatedDocument)).toBe(true);
    expect(schema.map((component) => component.id)).toEqual([
      "field-1",
      "action-1",
    ]);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "ADD_ACTION_COMPONENT",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle reorderComponents operation", () => {
    const document = utils.createDocument();
    document.state.global.schema = [
      createCustomComponent("component-a"),
      createSpacerComponent("component-b"),
    ];
    const input = {
      components: ["component-b"],
      insertBefore: "component-a",
    };

    const updatedDocument = reducer(document, reorderComponents(input));
    const schema = updatedDocument.state.global.schema;

    expect(isDocumentEditorBuilderDocument(updatedDocument)).toBe(true);
    expect(schema.map((component) => component.id)).toEqual([
      "component-b",
      "component-a",
    ]);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "REORDER_COMPONENTS",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle removeComponent operation", () => {
    const document = utils.createDocument();
    document.state.global.schema = [
      createActionComponent("action-1", "action-1"),
      createInputComponent("field-1", "action-1", "action-1"),
    ];
    const input = {
      componentId: "action-1",
    };

    const updatedDocument = reducer(document, removeComponent(input));
    const schema = updatedDocument.state.global.schema;

    expect(isDocumentEditorBuilderDocument(updatedDocument)).toBe(true);
    expect(
      schema.find((component) => component.id === "action-1"),
    ).toBeUndefined();
    expect(
      schema.find((component) => component.id === "field-1"),
    ).toBeUndefined();
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "REMOVE_COMPONENT",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle editActionComponent operation", () => {
    const document = utils.createDocument();
    document.state.global.schema = [
      createActionComponent("action-1", "action-1"),
    ];
    const input: EditActionComponentInput = {
      id: "action-1",
      actionId: "action-1",
      actionName: "Updated Action",
      trigger: "onSubmit",
      hasResetButton: false,
    };

    const updatedDocument = reducer(document, editActionComponent(input));
    const schema = updatedDocument.state.global.schema;
    const actionComponent = schema.find(
      (component) => component.id === "action-1",
    );
    const submitButton = schema.find(
      (component) => component.id === "submit-button-action-1",
    );

    expect(isDocumentEditorBuilderDocument(updatedDocument)).toBe(true);
    const actionConfig =
      actionComponent?.config as ActionComponentConfig | null;
    expect(actionConfig?.action?.name).toBe("Updated Action");
    expect(actionConfig?.formProps?.trigger).toBe("onSubmit");
    expect(submitButton?.type).toBe("input");
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "EDIT_ACTION_COMPONENT",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle editFieldActionComponent operation", () => {
    const document = utils.createDocument();
    document.state.global.schema = [
      createActionComponent("action-1", "action-1"),
      createInputComponent("field-1", "action-1", "action-1"),
    ];
    const input: EditFieldActionComponentInput = {
      fieldId: "field-1",
      scopeType: "default_value",
      scopeField: "name",
      scopeDefaultValue: "Default",
      name: "Updated Field",
    };

    const updatedDocument = reducer(document, editFieldActionComponent(input));
    const schema = updatedDocument.state.global.schema;
    const fieldComponent = schema.find(
      (component) => component.id === "field-1",
    );

    expect(isDocumentEditorBuilderDocument(updatedDocument)).toBe(true);
    const inputConfig = fieldComponent?.config as InputComponentConfig | null;
    expect(inputConfig?.field?.name).toBe("Updated Field");
    expect(inputConfig?.field?.scope?.type).toBe("default_value");
    expect(inputConfig?.field?.scope?.defaultValue).toBe("Default");
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "EDIT_FIELD_ACTION_COMPONENT",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle addComponent operation", () => {
    const document = utils.createDocument();
    const input: AddComponentInput = {
      id: "custom-component-id",
      type: "custom",
      control: "custom",
      name: "Custom Component",
      scope: null,
      scopeDataType: null,
      groupId: null,
      insertBefore: null,
    };

    const updatedDocument = reducer(document, addComponent(input));
    const schema = updatedDocument.state.global.schema;
    const customComponent = schema.find(
      (component) => component.id === "custom-component-id",
    );

    expect(isDocumentEditorBuilderDocument(updatedDocument)).toBe(true);
    expect(customComponent?.type).toBe("custom");
    const customConfig =
      customComponent?.config as CustomComponentConfig | null;
    expect(customConfig?.path).toBe("custom-component.tsx");
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "ADD_COMPONENT",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle editContentComponent operation", () => {
    const document = utils.createDocument();
    document.state.global.schema = [createContentComponent("content-1")];
    const input: EditContentComponentInput = {
      id: "content-1",
      label: "Title",
      text: "Hello",
      scope: "name",
      scopeDataType: "String",
      contentFormat: {
        date: {
          format: "yyyy-MM-dd",
        },
      },
    };

    const updatedDocument = reducer(document, editContentComponent(input));
    const schema = updatedDocument.state.global.schema;
    const contentComponent = schema.find(
      (component) => component.id === "content-1",
    );

    expect(isDocumentEditorBuilderDocument(updatedDocument)).toBe(true);
    const contentConfig =
      contentComponent?.config as ContentComponentConfig | null;
    expect(contentConfig?.label).toBe("Title");
    expect(contentConfig?.text).toBe("Hello");
    expect(contentConfig?.scope).toBe("name");
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "EDIT_CONTENT_COMPONENT",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle editCustomComponent operation", () => {
    const document = utils.createDocument();
    document.state.global.schema = [createCustomComponent("custom-1")];
    const input: EditCustomComponentInput = {
      id: "custom-1",
      name: "Renamed Custom",
      path: "renamed-custom.tsx",
    };

    const updatedDocument = reducer(document, editCustomComponent(input));
    const schema = updatedDocument.state.global.schema;
    const customComponent = schema.find(
      (component) => component.id === "custom-1",
    );

    expect(isDocumentEditorBuilderDocument(updatedDocument)).toBe(true);
    const customConfig =
      customComponent?.config as CustomComponentConfig | null;
    expect(customConfig?.name).toBe("Renamed Custom");
    expect(customConfig?.path).toBe("renamed-custom.tsx");
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "EDIT_CUSTOM_COMPONENT",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle createGroup operation", () => {
    const document = utils.createDocument();
    document.state.global.schema = [
      createCustomComponent("component-1"),
      createSpacerComponent("component-2"),
    ];
    const input: CreateGroupInput = {
      id: "group-1",
      componentIds: ["component-1", "component-2"],
      insertBefore: null,
    };

    const updatedDocument = reducer(document, createGroup(input));
    const schema = updatedDocument.state.global.schema;
    const groupComponent = schema.find(
      (component) => component.id === "group-1",
    );
    const groupedComponents = schema.filter(
      (component) =>
        component.id === "component-1" || component.id === "component-2",
    );

    expect(isDocumentEditorBuilderDocument(updatedDocument)).toBe(true);
    expect(groupComponent?.type).toBe("group");
    groupedComponents.forEach((component) => {
      expect(component.groupId).toBe("group-1");
    });
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "CREATE_GROUP",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle addToGroup operation", () => {
    const document = utils.createDocument();
    document.state.global.schema = [
      createGroupComponent("group-1"),
      createCustomComponent("component-1"),
    ];
    const input: AddToGroupInput = {
      id: "group-1",
      componentIds: ["component-1"],
    };

    const updatedDocument = reducer(document, addToGroup(input));
    const schema = updatedDocument.state.global.schema;
    const component = schema.find(
      (component) => component.id === "component-1",
    );

    expect(isDocumentEditorBuilderDocument(updatedDocument)).toBe(true);
    expect(component?.groupId).toBe("group-1");
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "ADD_TO_GROUP",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle removeFromGroup operation", () => {
    const document = utils.createDocument();
    document.state.global.schema = [
      createGroupComponent("group-1"),
      createCustomComponent("component-1", "group-1"),
      createSpacerComponent("component-2", "group-1"),
    ];
    const input: RemoveFromGroupInput = {
      id: "group-1",
      componentIds: ["component-1"],
    };

    const updatedDocument = reducer(document, removeFromGroup(input));
    const schema = updatedDocument.state.global.schema;
    const removedComponent = schema.find(
      (component) => component.id === "component-1",
    );
    const remainingComponent = schema.find(
      (component) => component.id === "component-2",
    );
    const groupComponent = schema.find(
      (component) => component.id === "group-1",
    );

    expect(isDocumentEditorBuilderDocument(updatedDocument)).toBe(true);
    expect(removedComponent?.groupId).toBeNull();
    expect(remainingComponent?.groupId).toBe("group-1");
    expect(groupComponent).toBeDefined();
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "REMOVE_FROM_GROUP",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle editGroupComponent operation", () => {
    const document = utils.createDocument();
    document.state.global.schema = [createGroupComponent("group-1")];
    const input: EditGroupComponentInput = {
      id: "group-1",
      layout: "column",
      gap: 12,
      paddingTop: 1,
      paddingRight: 2,
      paddingBottom: 3,
      paddingLeft: 4,
      minWidth: 10,
      maxWidth: 20,
      minHeight: 30,
      maxHeight: 40,
      horizontalOrientation: "center",
      verticalOrientation: "middle",
    };

    const updatedDocument = reducer(document, editGroupComponent(input));
    const groupComponent = updatedDocument.state.global.schema.find(
      (component) => component.id === "group-1",
    );

    expect(isDocumentEditorBuilderDocument(updatedDocument)).toBe(true);
    const groupConfig = groupComponent?.config as GroupComponentConfig | null;
    expect(groupConfig?.layout).toBe("column");
    expect(groupConfig?.gap).toBe(12);
    expect(groupConfig?.paddingTop).toBe(1);
    expect(groupConfig?.paddingRight).toBe(2);
    expect(groupConfig?.paddingBottom).toBe(3);
    expect(groupConfig?.paddingLeft).toBe(4);
    expect(groupConfig?.minWidth).toBe(10);
    expect(groupConfig?.maxWidth).toBe(20);
    expect(groupConfig?.minHeight).toBe(30);
    expect(groupConfig?.maxHeight).toBe(40);
    expect(groupConfig?.horizontalOrientation).toBe("center");
    expect(groupConfig?.verticalOrientation).toBe("middle");
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "EDIT_GROUP_COMPONENT",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle editSpacerComponent operation", () => {
    const document = utils.createDocument();
    document.state.global.schema = [createSpacerComponent("spacer-1")];
    const input: EditSpacerComponentInput = {
      id: "spacer-1",
      width: 10,
      height: 20,
    };

    const updatedDocument = reducer(document, editSpacerComponent(input));
    const spacerComponent = updatedDocument.state.global.schema.find(
      (component) => component.id === "spacer-1",
    );

    expect(isDocumentEditorBuilderDocument(updatedDocument)).toBe(true);
    const spacerConfig =
      spacerComponent?.config as SpacerComponentConfig | null;
    expect(spacerConfig?.width).toBe(10);
    expect(spacerConfig?.height).toBe(20);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "EDIT_SPACER_COMPONENT",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
