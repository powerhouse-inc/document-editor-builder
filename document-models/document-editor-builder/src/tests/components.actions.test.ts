/**
 * Expanded reducer tests for components operations.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/components/creators.js";
import type {
  ActionComponentConfig,
  EditorComponent,
  FieldDataType,
  GroupComponentConfig,
  InputComponentConfig,
} from "../../gen/types.js";
import { utils } from "../../utils.js";

const baseGroupConfig: GroupComponentConfig = {
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
};

const baseActionGroupConfig: GroupComponentConfig = {
  ...baseGroupConfig,
  layout: "column",
};

const createActionComponent = ({
  id,
  actionId,
  actionName = "Action",
  trigger = "onSubmit",
  hasResetButton = false,
  groupId = null,
}: {
  id: string;
  actionId: string;
  actionName?: string;
  trigger?: "onBlur" | "onChange" | "onSubmit";
  hasResetButton?: boolean;
  groupId?: string | null;
}): EditorComponent => ({
  id,
  type: "action",
  control: "form",
  groupId,
  config: {
    action: {
      id: actionId,
      name: actionName,
    },
    formProps: {
      trigger,
      hasResetButton,
    },
    group: baseActionGroupConfig,
  } satisfies ActionComponentConfig,
});

const createInputComponent = ({
  id,
  actionId,
  groupId,
  name = "Name",
  actionInput = "name",
  dataType = "String",
  scopeType = "binded",
  scopeField = "name",
}: {
  id: string;
  actionId: string;
  groupId: string;
  name?: string;
  actionInput?: string;
  dataType?: FieldDataType;
  scopeType?:
    | "binded"
    | "default_value"
    | "not_binded"
    | "submit_button"
    | "reset_button";
  scopeField?: string | null;
}): EditorComponent => ({
  id,
  type: "input",
  control: "input",
  groupId,
  config: {
    actionId,
    field: {
      name,
      actionInput,
      dataType,
      props: null,
      scope: {
        type: scopeType,
        field: scopeField,
        defaultValue: null,
      },
    },
  } satisfies InputComponentConfig,
});

const createSubmitButtonComponent = ({
  id,
  actionId,
  groupId,
  text = "Submit",
  variant = "default",
}: {
  id: string;
  actionId: string;
  groupId: string;
  text?: string;
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "destructive"
    | "ghost"
    | "link";
}): EditorComponent => ({
  id,
  type: "input",
  control: "input",
  groupId,
  config: {
    actionId,
    field: {
      name: text,
      actionInput: "",
      dataType: null,
      props: {
        text,
        variant,
      },
      scope: {
        type: "submit_button",
        field: null,
        defaultValue: null,
      },
    },
  } satisfies InputComponentConfig,
});

const createResetButtonComponent = ({
  id,
  actionId,
  groupId,
  text = "Reset",
  variant = "secondary",
}: {
  id: string;
  actionId: string;
  groupId: string;
  text?: string;
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "destructive"
    | "ghost"
    | "link";
}): EditorComponent => ({
  id,
  type: "input",
  control: "input",
  groupId,
  config: {
    actionId,
    field: {
      name: text,
      actionInput: "",
      dataType: null,
      props: {
        text,
        variant,
      },
      scope: {
        type: "reset_button",
        field: null,
        defaultValue: null,
      },
    },
  } satisfies InputComponentConfig,
});

const createContentComponent = ({
  id,
  groupId = null,
}: {
  id: string;
  groupId?: string | null;
}): EditorComponent => ({
  id,
  type: "content",
  control: "label",
  groupId,
  config: {
    label: "Label",
    scope: null,
    scopeDataType: null,
    text: "Content",
    contentFormat: null,
  },
});

const createGroupComponent = ({
  id,
  groupId = null,
}: {
  id: string;
  groupId?: string | null;
}): EditorComponent => ({
  id,
  type: "group",
  control: "group",
  groupId,
  config: baseGroupConfig,
});

const createCustomComponent = ({
  id,
  name = "Custom Component",
  path = "custom-component.tsx",
}: {
  id: string;
  name?: string;
  path?: string;
}): EditorComponent => ({
  id,
  type: "custom",
  control: "custom",
  groupId: null,
  config: {
    name,
    path,
  },
});

const createSpacerComponent = ({
  id,
  width = null,
  height = null,
}: {
  id: string;
  width?: number | null;
  height?: number | null;
}): EditorComponent => ({
  id,
  type: "spacer",
  control: "spacer",
  groupId: null,
  config: {
    width,
    height,
  },
});

const getSchema = (document: ReturnType<typeof utils.createDocument>) =>
  document.state.global.schema;

const getLastOperation = (document: ReturnType<typeof utils.createDocument>) =>
  document.operations.global[document.operations.global.length - 1];

const createDocumentWithSchema = (schema: EditorComponent[]) => {
  const baseGlobal = utils.createState().global;
  return utils.createDocument({
    global: {
      ...baseGlobal,
      schema,
    },
  });
};

describe("Components Operations - Expanded Coverage", () => {
  let document: ReturnType<typeof utils.createDocument>;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("adds an action component with submit button on onSubmit", () => {
    const updated = reducer(
      document,
      creators.addActionComponent({
        id: "action-1",
        actionId: "action-id-1",
        actionName: "Create",
        trigger: "onSubmit",
        initialFields: [
          {
            id: "field-1",
            actionInput: "name",
            dataType: "String",
            scope: "name",
          },
        ],
      })
    );

    const schema = getSchema(updated);
    expect(schema.map((c) => c.id)).toEqual([
      "field-1",
      "submit-button-action-1",
      "action-1",
    ]);
    const submitButton = schema.find((c) => c.id === "submit-button-action-1");
    expect(submitButton?.type).toBe("input");
    const actionComponent = schema.find((c) => c.id === "action-1");
    const actionConfig = actionComponent?.config as ActionComponentConfig;
    expect(actionConfig.formProps?.trigger).toBe("onSubmit");
  });

  it("forces trigger to onBlur when onChange has multiple fields", () => {
    const updated = reducer(
      document,
      creators.addActionComponent({
        id: "action-2",
        actionId: "action-id-2",
        actionName: "Update",
        trigger: "onChange",
        initialFields: [
          {
            id: "field-2a",
            actionInput: "title",
            dataType: "String",
            scope: "title",
          },
          {
            id: "field-2b",
            actionInput: "description",
            dataType: "String",
            scope: "description",
          },
        ],
      })
    );

    const schema = getSchema(updated);
    const actionComponent = schema.find((c) => c.id === "action-2");
    const actionConfig = actionComponent?.config as ActionComponentConfig;
    expect(actionConfig.formProps?.trigger).toBe("onBlur");
    expect(schema.find((c) => c.id === "submit-button-action-2")).toBeFalsy();
  });

  it("reorders components based on insertBefore", () => {
    document = createDocumentWithSchema([
      createContentComponent({ id: "content-1" }),
      createContentComponent({ id: "content-2" }),
      createContentComponent({ id: "content-3" }),
    ]);

    const updated = reducer(
      document,
      creators.reorderComponents({
        components: ["content-2"],
        insertBefore: "content-1",
      })
    );

    expect(getSchema(updated).map((c) => c.id)).toEqual([
      "content-2",
      "content-1",
      "content-3",
    ]);
  });

  it("reorders components to the end when insertBefore is omitted", () => {
    document = createDocumentWithSchema([
      createContentComponent({ id: "content-1" }),
      createContentComponent({ id: "content-2" }),
      createContentComponent({ id: "content-3" }),
    ]);

    const updated = reducer(
      document,
      creators.reorderComponents({
        components: ["content-1"],
        insertBefore: null,
      })
    );

    expect(getSchema(updated).map((c) => c.id)).toEqual([
      "content-2",
      "content-3",
      "content-1",
    ]);
  });

  it("reorders components within a group without changing groupId", () => {
    document = createDocumentWithSchema([
      createGroupComponent({ id: "group-1" }),
      createContentComponent({ id: "content-1", groupId: "group-1" }),
      createContentComponent({ id: "content-2", groupId: "group-1" }),
    ]);

    const updated = reducer(
      document,
      creators.reorderComponents({
        components: ["content-2"],
        insertBefore: "content-1",
      })
    );

    const schema = getSchema(updated);
    const reordered = schema.filter((c) => c.groupId === "group-1");
    expect(reordered.map((c) => c.id)).toEqual(["content-2", "content-1"]);
    expect(reordered.every((c) => c.groupId === "group-1")).toBe(true);
  });

  it("removes a group and re-parents its children", () => {
    document = createDocumentWithSchema([
      createGroupComponent({ id: "group-1" }),
      createContentComponent({ id: "content-1", groupId: "group-1" }),
    ]);

    const updated = reducer(
      document,
      creators.removeComponent({ componentId: "group-1" })
    );

    expect(getSchema(updated).map((c) => c.id)).toEqual(["content-1"]);
    expect(getSchema(updated)[0]?.groupId).toBeNull();
  });

  it("removes a group with mixed nested children", () => {
    document = createDocumentWithSchema([
      createGroupComponent({ id: "group-1" }),
      createGroupComponent({ id: "group-2", groupId: "group-1" }),
      createContentComponent({ id: "content-1", groupId: "group-2" }),
      createCustomComponent({ id: "custom-1" }),
      createSpacerComponent({ id: "spacer-1" }),
    ]);

    const updated = reducer(
      document,
      creators.removeComponent({ componentId: "group-1" })
    );

    const schema = getSchema(updated);
    expect(schema.find((c) => c.id === "group-1")).toBeFalsy();
    expect(schema.find((c) => c.id === "group-2")?.groupId).toBeNull();
    expect(schema.find((c) => c.id === "content-1")?.groupId).toBe("group-2");
  });

  it("removes a group and preserves nested group relationships", () => {
    document = createDocumentWithSchema([
      createGroupComponent({ id: "group-1" }),
      createGroupComponent({ id: "group-2", groupId: "group-1" }),
      createContentComponent({ id: "content-1", groupId: "group-2" }),
    ]);

    const updated = reducer(
      document,
      creators.removeComponent({ componentId: "group-1" })
    );

    const schema = getSchema(updated);
    const group2 = schema.find((c) => c.id === "group-2");
    const content = schema.find((c) => c.id === "content-1");
    expect(group2?.groupId).toBeNull();
    expect(content?.groupId).toBe("group-2");
  });

  it("removes an action and its inputs", () => {
    document = createDocumentWithSchema([
      createInputComponent({
        id: "field-1",
        actionId: "action-id-1",
        groupId: "action-1",
      }),
      createActionComponent({
        id: "action-1",
        actionId: "action-id-1",
        actionName: "Save",
      }),
    ]);

    const updated = reducer(
      document,
      creators.removeComponent({ componentId: "action-1" })
    );

    expect(getSchema(updated)).toHaveLength(0);
  });

  it("records an error when removing a missing component", () => {
    const updated = reducer(
      document,
      creators.removeComponent({ componentId: "missing" })
    );
    expect(updated.operations.global[0]?.error).toBe(
      "Component with id missing not found"
    );
  });

  it("edits action fields, trigger, and reset button", () => {
    document = createDocumentWithSchema([
      createInputComponent({
        id: "field-1",
        actionId: "action-id-1",
        groupId: "action-1",
        dataType: "String",
      }),
      createInputComponent({
        id: "field-2",
        actionId: "action-id-1",
        groupId: "action-1",
        dataType: "String",
      }),
      createActionComponent({
        id: "action-1",
        actionId: "action-id-1",
        actionName: "Save",
        trigger: "onSubmit",
      }),
    ]);

    const updated = reducer(
      document,
      creators.editActionComponent({
        id: "action-1",
        actionName: "Save Changes",
        trigger: "onChange",
        hasResetButton: true,
        fields: [
          {
            id: "field-1",
            actionInput: "title",
            dataType: "String",
            name: "Title",
            scope: "title",
          },
        ],
      })
    );

    const schema = getSchema(updated);
    expect(schema.find((c) => c.id === "field-2")).toBeFalsy();
    const actionComponent = schema.find((c) => c.id === "action-1");
    const actionConfig = actionComponent?.config as ActionComponentConfig;
    expect(actionConfig.action?.name).toBe("Save Changes");
    expect(actionConfig.formProps?.trigger).toBe("onBlur");
    expect(schema.find((c) => c.id === "reset-button-action-1")).toBeTruthy();
    expect(schema.find((c) => c.id === "submit-button-action-1")).toBeFalsy();
  });

  it("downgrades onChange trigger when no fields remain", () => {
    document = createDocumentWithSchema([
      createInputComponent({
        id: "field-1",
        actionId: "action-id-1",
        groupId: "action-1",
      }),
      createActionComponent({
        id: "action-1",
        actionId: "action-id-1",
        actionName: "Save",
        trigger: "onSubmit",
      }),
    ]);

    const updated = reducer(
      document,
      creators.editActionComponent({
        id: "action-1",
        trigger: "onChange",
        fields: [],
      })
    );

    const actionComponent = getSchema(updated).find((c) => c.id === "action-1");
    const actionConfig = actionComponent?.config as ActionComponentConfig;
    expect(actionConfig.formProps?.trigger).toBe("onBlur");
  });

  it("updates trigger and submit button when trigger changes without fields", () => {
    document = createDocumentWithSchema([
      createInputComponent({
        id: "field-1",
        actionId: "action-id-1",
        groupId: "action-1",
        dataType: "String",
      }),
      createSubmitButtonComponent({
        id: "submit-button-action-1",
        actionId: "action-id-1",
        groupId: "action-1",
      }),
      createActionComponent({
        id: "action-1",
        actionId: "action-id-1",
        actionName: "Save",
        trigger: "onSubmit",
      }),
    ]);

    const updated = reducer(
      document,
      creators.editActionComponent({
        id: "action-1",
        trigger: "onChange",
      })
    );

    const schema = getSchema(updated);
    const actionComponent = schema.find((c) => c.id === "action-1");
    const actionConfig = actionComponent?.config as ActionComponentConfig;
    expect(actionConfig.formProps?.trigger).toBe("onBlur");
    expect(schema.find((c) => c.id === "submit-button-action-1")).toBeFalsy();
  });

  it("toggles submit button when fields change on an action", () => {
    document = createDocumentWithSchema([
      createInputComponent({
        id: "field-1",
        actionId: "action-id-1",
        groupId: "action-1",
        dataType: "String",
      }),
      createInputComponent({
        id: "field-2",
        actionId: "action-id-1",
        groupId: "action-1",
        dataType: "String",
      }),
      createSubmitButtonComponent({
        id: "submit-button-action-1",
        actionId: "action-id-1",
        groupId: "action-1",
      }),
      createActionComponent({
        id: "action-1",
        actionId: "action-id-1",
        actionName: "Save",
        trigger: "onSubmit",
      }),
    ]);

    const updated = reducer(
      document,
      creators.editActionComponent({
        id: "action-1",
        fields: [
          {
            id: "field-1",
            actionInput: "title",
            dataType: "String",
            name: "Title",
            scope: "title",
          },
        ],
      })
    );

    const schemaAfterRemove = getSchema(updated);
    expect(
      schemaAfterRemove.find((c) => c.id === "submit-button-action-1")
    ).toBeFalsy();

    const updatedAgain = reducer(
      updated,
      creators.editActionComponent({
        id: "action-1",
        fields: [
          {
            id: "field-1",
            actionInput: "title",
            dataType: "String",
            name: "Title",
            scope: "title",
          },
          {
            id: "field-2",
            actionInput: "description",
            dataType: "String",
            name: "Description",
            scope: "description",
          },
        ],
      })
    );

    const schemaAfterAdd = getSchema(updatedAgain);
    expect(
      schemaAfterAdd.find((c) => c.id === "submit-button-action-1")
    ).toBeTruthy();
  });

  it("drops old fields when actionId changes", () => {
    document = createDocumentWithSchema([
      createInputComponent({
        id: "field-1",
        actionId: "action-id-1",
        groupId: "action-1",
      }),
      createActionComponent({
        id: "action-1",
        actionId: "action-id-1",
        actionName: "Save",
      }),
    ]);

    const updated = reducer(
      document,
      creators.editActionComponent({
        id: "action-1",
        actionId: "action-id-2",
      })
    );

    const schema = getSchema(updated);
    expect(schema.find((c) => c.id === "field-1")).toBeFalsy();
    const actionComponent = schema.find((c) => c.id === "action-1");
    const actionConfig = actionComponent?.config as ActionComponentConfig;
    expect(actionConfig.action?.id).toBe("action-id-2");
  });

  it("updates actionId and rebuilds fields when fields are provided", () => {
    document = createDocumentWithSchema([
      createInputComponent({
        id: "field-1",
        actionId: "action-id-1",
        groupId: "action-1",
      }),
      createActionComponent({
        id: "action-1",
        actionId: "action-id-1",
        actionName: "Save",
      }),
    ]);

    const updated = reducer(
      document,
      creators.editActionComponent({
        id: "action-1",
        actionId: "action-id-2",
        fields: [
          {
            id: "field-2",
            actionInput: "title",
            dataType: "String",
            name: "Title",
            scope: "title",
          },
        ],
      })
    );

    const schema = getSchema(updated);
    expect(schema.find((c) => c.id === "field-1")).toBeFalsy();
    const newField = schema.find((c) => c.id === "field-2");
    const fieldConfig = newField?.config as InputComponentConfig;
    expect(fieldConfig.actionId).toBe("action-id-2");
  });

  it("updates actionId and removes old buttons when fields are not provided", () => {
    document = createDocumentWithSchema([
      createInputComponent({
        id: "field-1",
        actionId: "action-id-1",
        groupId: "action-1",
      }),
      createSubmitButtonComponent({
        id: "submit-button-action-1",
        actionId: "action-id-1",
        groupId: "action-1",
      }),
      createResetButtonComponent({
        id: "reset-button-action-1",
        actionId: "action-id-1",
        groupId: "action-1",
      }),
      createActionComponent({
        id: "action-1",
        actionId: "action-id-1",
        actionName: "Save",
        trigger: "onSubmit",
        hasResetButton: true,
      }),
    ]);

    const updated = reducer(
      document,
      creators.editActionComponent({
        id: "action-1",
        actionId: "action-id-2",
      })
    );

    const schema = getSchema(updated);
    const submit = schema.find((c) => c.id === "submit-button-action-1");
    const reset = schema.find((c) => c.id === "reset-button-action-1");
    expect(submit).toBeTruthy();
    expect(reset).toBeTruthy();
    const submitConfig = submit?.config as InputComponentConfig;
    const resetConfig = reset?.config as InputComponentConfig;
    expect(submitConfig.actionId).toBe("action-id-2");
    expect(resetConfig.actionId).toBe("action-id-2");
  });

  it("edits a field action component and merges props", () => {
    document = createDocumentWithSchema([
      createInputComponent({
        id: "field-1",
        actionId: "action-id-1",
        groupId: "action-1",
      }),
      createActionComponent({
        id: "action-1",
        actionId: "action-id-1",
        actionName: "Save",
      }),
    ]);

    const updated = reducer(
      document,
      creators.editFieldActionComponent({
        fieldId: "field-1",
        name: "Title",
        scopeType: "default_value",
        scopeField: "title",
        scopeDefaultValue: "Draft",
        props: {
          string: {
            placeholder: "Enter title",
            maxLength: 50,
          },
        },
      })
    );

    const field = getSchema(updated).find((c) => c.id === "field-1");
    const fieldConfig = field?.config as InputComponentConfig;
    expect(fieldConfig.field?.name).toBe("Title");
    expect(fieldConfig.field?.scope?.type).toBe("default_value");
    expect(fieldConfig.field?.scope?.field).toBe("title");
    expect(fieldConfig.field?.scope?.defaultValue).toBe("Draft");
    expect(fieldConfig.field?.props).toEqual({
      placeholder: "Enter title",
      maxLength: 50,
    });
  });

  it("edits submit button field props safely", () => {
    document = createDocumentWithSchema([
      createSubmitButtonComponent({
        id: "submit-button-action-1",
        actionId: "action-id-1",
        groupId: "action-1",
      }),
      createActionComponent({
        id: "action-1",
        actionId: "action-id-1",
      }),
    ]);

    const updated = reducer(
      document,
      creators.editFieldActionComponent({
        fieldId: "submit-button-action-1",
        name: "Send",
        props: {
          button: {
            text: "Send",
            variant: "outline",
          },
        },
      })
    );

    const button = getSchema(updated).find(
      (c) => c.id === "submit-button-action-1"
    );
    const buttonConfig = button?.config as InputComponentConfig;
    expect(buttonConfig.field?.name).toBe("Send");
    expect(buttonConfig.field?.props).toEqual({
      text: "Send",
      variant: "outline",
    });
  });

  it("removes reset button when hasResetButton is false", () => {
    document = createDocumentWithSchema([
      createResetButtonComponent({
        id: "reset-button-action-1",
        actionId: "action-id-1",
        groupId: "action-1",
      }),
      createActionComponent({
        id: "action-1",
        actionId: "action-id-1",
        actionName: "Save",
        hasResetButton: true,
      }),
    ]);

    const updated = reducer(
      document,
      creators.editActionComponent({
        id: "action-1",
        hasResetButton: false,
      })
    );

    expect(
      getSchema(updated).find((c) => c.id === "reset-button-action-1")
    ).toBeFalsy();
  });

  it("adds components with default config per type", () => {
    const updated = reducer(
      document,
      creators.addComponent({
        id: "custom-1",
        type: "custom",
        control: "custom",
        name: "My Custom",
      })
    );

    const custom = getSchema(updated).find((c) => c.id === "custom-1");
    expect(custom?.type).toBe("custom");
    expect(custom?.config).toMatchObject({
      name: "My Custom",
      path: "my-custom.tsx",
    });
  });

  it("inserts components before a given id", () => {
    document = createDocumentWithSchema([
      createContentComponent({ id: "content-1" }),
      createContentComponent({ id: "content-2" }),
    ]);

    const updated = reducer(
      document,
      creators.addComponent({
        id: "custom-1",
        type: "custom",
        control: "custom",
        name: "Insert",
        insertBefore: "content-2",
      })
    );

    expect(getSchema(updated).map((c) => c.id)).toEqual([
      "content-1",
      "custom-1",
      "content-2",
    ]);
  });

  it("inserts components before a given id", () => {
    document = createDocumentWithSchema([
      createContentComponent({ id: "content-1" }),
      createContentComponent({ id: "content-2" }),
    ]);

    const updated = reducer(
      document,
      creators.addComponent({
        id: "custom-1",
        type: "custom",
        control: "custom",
        name: "Insert",
        insertBefore: "content-2",
      })
    );

    expect(getSchema(updated).map((c) => c.id)).toEqual([
      "content-1",
      "custom-1",
      "content-2",
    ]);
  });

  it("adds content, group, spacer, and action components", () => {
    const updated = reducer(
      document,
      creators.addComponent({
        id: "content-1",
        type: "content",
        control: "label",
      })
    );

    const updated2 = reducer(
      updated,
      creators.addComponent({
        id: "group-1",
        type: "group",
        control: "group",
      })
    );

    const updated3 = reducer(
      updated2,
      creators.addComponent({
        id: "spacer-1",
        type: "spacer",
        control: "spacer",
      })
    );

    const updated4 = reducer(
      updated3,
      creators.addComponent({
        id: "action-1",
        type: "action",
        control: "form",
      })
    );

    const schema = getSchema(updated4);
    expect(schema.find((c) => c.id === "content-1")?.type).toBe("content");
    expect(schema.find((c) => c.id === "group-1")?.type).toBe("group");
    expect(schema.find((c) => c.id === "spacer-1")?.type).toBe("spacer");
    expect(schema.find((c) => c.id === "action-1")?.type).toBe("action");
  });

  it("edits content component and merges format", () => {
    document = createDocumentWithSchema([
      createContentComponent({ id: "content-1" }),
    ]);

    const updated = reducer(
      document,
      creators.editContentComponent({
        id: "content-1",
        label: "Updated",
        contentFormat: {
          date: { format: "YYYY-MM-DD" },
        },
      })
    );

    const content = getSchema(updated).find((c) => c.id === "content-1");
    expect(content?.config).toMatchObject({
      label: "Updated",
      contentFormat: {
        format: "YYYY-MM-DD",
      },
    });
  });

  it("keeps last content format payload when multiple formats provided", () => {
    document = createDocumentWithSchema([
      createContentComponent({ id: "content-1" }),
    ]);

    const updated = reducer(
      document,
      creators.editContentComponent({
        id: "content-1",
        contentFormat: {
          date: { format: "YYYY-MM-DD" },
          int: { unit: "items" },
        },
      })
    );

    const content = getSchema(updated).find((c) => c.id === "content-1");
    expect(content?.config).toMatchObject({
      contentFormat: {
        unit: "items",
      },
    });
  });

  it("edits custom and spacer components", () => {
    document = createDocumentWithSchema([
      createCustomComponent({ id: "custom-1" }),
      createSpacerComponent({ id: "spacer-1", width: 10, height: 5 }),
    ]);

    const updated = reducer(
      document,
      creators.editCustomComponent({
        id: "custom-1",
        name: "Custom Updated",
        path: "custom-updated.tsx",
      })
    );

    const updated2 = reducer(
      updated,
      creators.editSpacerComponent({
        id: "spacer-1",
        width: null,
        height: 12,
      })
    );

    const custom = getSchema(updated2).find((c) => c.id === "custom-1");
    expect(custom?.config).toMatchObject({
      name: "Custom Updated",
      path: "custom-updated.tsx",
    });
    const spacer = getSchema(updated2).find((c) => c.id === "spacer-1");
    expect(spacer?.config).toMatchObject({
      width: null,
      height: 12,
    });
  });

  it("treats undefined as no-op and null as reset for spacer props", () => {
    document = createDocumentWithSchema([
      createSpacerComponent({ id: "spacer-1", width: 10, height: 5 }),
    ]);

    const updated = reducer(
      document,
      creators.editSpacerComponent({
        id: "spacer-1",
        width: undefined,
        height: null,
      })
    );

    const spacer = getSchema(updated).find((c) => c.id === "spacer-1");
    expect(spacer?.config).toMatchObject({
      width: 10,
      height: null,
    });
  });

  it("creates a group and assigns children to it", () => {
    document = createDocumentWithSchema([
      createContentComponent({ id: "content-1" }),
      createContentComponent({ id: "content-2" }),
    ]);

    const updated = reducer(
      document,
      creators.createGroup({
        id: "group-1",
        componentIds: ["content-1", "content-2"],
      })
    );

    const schema = getSchema(updated);
    const group = schema.find((c) => c.id === "group-1");
    expect(group?.type).toBe("group");
    expect(schema.find((c) => c.id === "content-1")?.groupId).toBe("group-1");
    expect(schema.find((c) => c.id === "content-2")?.groupId).toBe("group-1");
  });

  it("adds components to group and prevents nested actions", () => {
    document = createDocumentWithSchema([
      createActionComponent({
        id: "action-1",
        actionId: "action-id-1",
      }),
      createGroupComponent({ id: "group-1", groupId: "action-1" }),
      createContentComponent({ id: "content-1" }),
      createActionComponent({
        id: "action-2",
        actionId: "action-id-2",
      }),
    ]);

    const updated = reducer(
      document,
      creators.addToGroup({
        id: "group-1",
        componentIds: ["content-1"],
      })
    );
    expect(getSchema(updated).find((c) => c.id === "content-1")?.groupId).toBe(
      "group-1"
    );

    const invalidAdd = reducer(
      updated,
      creators.addToGroup({
        id: "group-1",
        componentIds: ["action-2"],
      })
    );
    expect(getLastOperation(invalidAdd)?.error).toBe(
      "Cannot add Action Components inside another Action Component"
    );
  });

  it("allows adding an action component into a non-action group", () => {
    document = createDocumentWithSchema([
      createGroupComponent({ id: "group-1" }),
      createActionComponent({
        id: "action-1",
        actionId: "action-id-1",
      }),
    ]);

    const updated = reducer(
      document,
      creators.addToGroup({
        id: "group-1",
        componentIds: ["action-1"],
      })
    );

    expect(getSchema(updated).find((c) => c.id === "action-1")?.groupId).toBe(
      "group-1"
    );
  });

  it("records an error when adding to a missing group", () => {
    const updated = reducer(
      document,
      creators.addToGroup({ id: "missing-group", componentIds: ["x"] })
    );
    expect(updated.operations.global[0]?.error).toBe(
      "Group component with id missing-group not found"
    );
  });

  it("removes from group and removes empty group", () => {
    document = createDocumentWithSchema([
      createGroupComponent({ id: "group-1" }),
      createContentComponent({ id: "content-1", groupId: "group-1" }),
    ]);

    const updated = reducer(
      document,
      creators.removeFromGroup({
        id: "group-1",
        componentIds: ["content-1"],
      })
    );

    const schema = getSchema(updated);
    expect(schema.map((c) => c.id)).toEqual(["content-1"]);
    expect(schema[0]?.groupId).toBeNull();
  });

  it("removes from group without deleting group when not empty", () => {
    document = createDocumentWithSchema([
      createGroupComponent({ id: "group-1" }),
      createContentComponent({ id: "content-1", groupId: "group-1" }),
      createContentComponent({ id: "content-2", groupId: "group-1" }),
    ]);

    const updated = reducer(
      document,
      creators.removeFromGroup({
        id: "group-1",
        componentIds: ["content-1"],
      })
    );

    const schema = getSchema(updated);
    expect(schema.find((c) => c.id === "group-1")).toBeTruthy();
    expect(schema.find((c) => c.id === "content-1")?.groupId).toBeNull();
    expect(schema.find((c) => c.id === "content-2")?.groupId).toBe("group-1");
  });

  it("removes from group without deleting group when not empty", () => {
    document = createDocumentWithSchema([
      createGroupComponent({ id: "group-1" }),
      createContentComponent({ id: "content-1", groupId: "group-1" }),
      createContentComponent({ id: "content-2", groupId: "group-1" }),
    ]);

    const updated = reducer(
      document,
      creators.removeFromGroup({
        id: "group-1",
        componentIds: ["content-1"],
      })
    );

    const schema = getSchema(updated);
    expect(schema.find((c) => c.id === "group-1")).toBeTruthy();
    expect(schema.find((c) => c.id === "content-1")?.groupId).toBeNull();
    expect(schema.find((c) => c.id === "content-2")?.groupId).toBe("group-1");
  });

  it("prevents removing nested inputs from an action group", () => {
    document = createDocumentWithSchema([
      createActionComponent({
        id: "action-1",
        actionId: "action-id-1",
      }),
      createGroupComponent({ id: "group-1", groupId: "action-1" }),
      createInputComponent({
        id: "field-1",
        actionId: "action-id-1",
        groupId: "group-1",
      }),
    ]);

    const updated = reducer(
      document,
      creators.removeFromGroup({
        id: "action-1",
        componentIds: ["group-1"],
      })
    );
    expect(updated.operations.global[0]?.error).toBe(
      "Cannot remove a component with nested inputs from an action group"
    );
  });

  it("edits group component props on group and action", () => {
    document = createDocumentWithSchema([
      createGroupComponent({ id: "group-1" }),
      createActionComponent({
        id: "action-1",
        actionId: "action-id-1",
      }),
    ]);

    const updated = reducer(
      document,
      creators.editGroupComponent({
        id: "group-1",
        layout: "column",
        gap: 12,
        paddingTop: 4,
      })
    );

    const updated2 = reducer(
      updated,
      creators.editGroupComponent({
        id: "action-1",
        layout: "row",
        gap: 6,
      })
    );

    const group = getSchema(updated2).find((c) => c.id === "group-1");
    const action = getSchema(updated2).find((c) => c.id === "action-1");
    expect(group?.config).toMatchObject({
      layout: "column",
      gap: 12,
      paddingTop: 4,
    });
    const actionConfig = action?.config as ActionComponentConfig;
    expect(actionConfig.group).toMatchObject({
      layout: "row",
      gap: 6,
    });
  });
});
