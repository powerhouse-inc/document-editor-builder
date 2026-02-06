import type { DocumentModelGlobalState } from "document-model";

export const documentModel: DocumentModelGlobalState = {
  author: {
    name: "Obiio",
    website: "",
  },
  description:
    'A document model for building document editors. This model only works with documents of type "powerhouse/document-model". Each document-model has its own documentType (e.g., "powerhouse/todo", "powerhouse/invoice") which is selected when building the editor. This model allows you to create visual editors by defining components that can display content, trigger actions, and collect input. Components can be organized into groups for layout control (gap, padding, row/column). Forms are special groups that cannot contain other forms, even if nested within groups. The editor name determines the folder and file names for the generated editor code.',
  extension: ".phdm",
  id: "powerhouse/document-editor-builder",
  name: "Document Editor Builder",
  specifications: [
    {
      changeLog: [],
      modules: [
        {
          description: "",
          id: "3cce604a-c211-48de-ae86-8d07b2ea9567",
          name: "document_type",
          operations: [
            {
              description:
                'Sets the target document type and optional document name for the editor being built. The documentType must be a valid "powerhouse/document-model" document type (e.g., "powerhouse/todo", "powerhouse/invoice"). When the document type changes, the schema is automatically cleared. The document name is used to generate the editor folder and file names.',
              errors: [],
              examples: [],
              id: "6815c2e8-40b2-4dfe-94ce-42d601231dcb",
              name: "SET_DOCUMENT_TYPE",
              reducer: "",
              schema:
                "input SetDocumentTypeInput {\n  documentType: String\n  documentName: String\n}",
              scope: "global",
              template: "",
            },
            {
              description:
                "Updates the name of the document editor. This name is used to generate the folder and file names for the editor code that will be created.",
              errors: [],
              examples: [],
              id: "8d0ed215-7996-49a6-b373-9e8b37f6964a",
              name: "SET_NEW_DOCUMENT_NAME",
              reducer: "",
              schema: "input SetNewDocumentNameInput {\n  name: String!\n}",
              scope: "global",
              template: "",
            },
          ],
        },
        {
          description: "",
          id: "9b21440c-4bd1-4d59-b0bc-e4d6611afc25",
          name: "components",
          operations: [
            {
              description:
                'Adds a new action component (form) with initial input fields. Action components trigger document operations when submitted. The component is inserted at the specified position or at the end if no position is provided. All initial fields are automatically associated with the action and grouped under the form. All the required fields from the action chosen are being included, but the optional ones can be added later. When the trigger is set to "onSubmit", a button input field is automatically created and added to the form. If a field has scope type "submit_button" or "reset_button", they are a button field and does not require actionInput or dataType fields. For fields with scopeType "binded", the scope field is required and must be the name of a state field from the document model schema (e.g., if state has field "name", scope should be "name"). Fields with actionInput names matching state field names are typically binded to those fields automatically.',
              errors: [],
              examples: [],
              id: "5781cff9-7196-4977-b095-d873302509c8",
              name: "ADD_ACTION_COMPONENT",
              reducer: "",
              schema:
                "input AddActionComponentInput {\n  id: OID!\n  control: EditorComponentControl\n  actionId: OID!\n  actionName: String!\n  trigger: CallbackTrigger\n  initialFields: [AddEditorActionFieldInput!]!\n  insertBefore: OID\n}\n\ninput AddEditorActionFieldInput {\n  id: OID!\n  actionInput: String\n  scope: String\n  dataType: FieldDataType\n}",
              scope: "global",
              template: "",
            },
            {
              description:
                "Reorders one or more components by moving them to a new position. The first component in the components array is moved to the position before insertBefore (or to the end if not specified).",
              errors: [],
              examples: [],
              id: "00fa4b58-b0b8-452b-86b9-32482f6b8b7f",
              name: "REORDER_COMPONENTS",
              reducer: "",
              schema:
                "input ReorderComponentsInput {\n  components: [OID!]!\n  insertBefore: OID\n}",
              scope: "global",
              template: "",
            },
            {
              description:
                "Removes a component from the schema. If the component is an action, all the child components, that are inputs of the action being removed, are also removed. Components that were grouped under the removed component are moved to the parent group (if any).",
              errors: [],
              examples: [],
              id: "22c7bc77-94fc-47dd-a778-04709aa23ee4",
              name: "REMOVE_COMPONENT",
              reducer: "",
              schema: "input RemoveComponentInput {\n  componentId: OID!\n}\n",
              scope: "global",
              template: "",
            },
            {
              description:
                'Edits an existing action component (form). Can update the action ID, action name, form trigger behavior, and associated input fields. When the action ID changes, old fields are removed and new ones can be added. The trigger behavior defines when the form dispatches the assigned action: onSubmit (dispatches with a submit button), onChange (dispatches on every field change), or onBlur (dispatches when a field loses focus). When the trigger is changed to "onSubmit", a button input field is automatically created and added to the form. When changed away from "onSubmit", any existing button fields are automatically removed. Button fields are identified by having scope type "submit_button" or "reset_button" and are rendered as buttons inputs in the form. For fields with scopeType "binded", the scope field is required and must be the name of a state field from the document model schema. Fields with actionInput names matching state field names are typically binded to those fields automatically.',
              errors: [],
              examples: [],
              id: "ab902fae-1c38-49c2-bc64-72e12157f917",
              name: "EDIT_ACTION_COMPONENT",
              reducer: "",
              schema:
                "input EditActionComponentInput {\n  id: OID!\n  control: String\n  actionId: OID\n  actionName: String\n  fields: [EditEditorActionFieldInput!]\n  trigger: CallbackTrigger\n  hasResetButton: Boolean\n}\n\ninput EditEditorActionFieldInput {\n  id: OID!\n  actionInput: String\n  scope: String\n  name: String\n  dataType: FieldDataType\n}",
              scope: "global",
              template: "",
            },
            {
              description:
                'Edits the properties of an input field component. Can update the field name, scope binding (how it connects to document state), and field-specific props including validation rules, placeholders, and display options based on the field data type. The props input uses FieldScalarPropsInput which accepts partial updates - only the changed properties need to be sent. For button fields (fields with scope type "submit_button" or "reset_button"), use ButtonFieldPropsInput to set the button text and variant. Note that fields with scope type "submit_button" or "reset_button" do not require actionInput or dataType fields, as they are special input components that render as submit buttons. When scopeType is "binded", scopeField is required and must be the name of a state field from the document model schema (e.g., "name" if state has a "name" field).',
              errors: [],
              examples: [],
              id: "a3964e6b-c100-484d-9e98-1ea8a24a37c9",
              name: "EDIT_FIELD_ACTION_COMPONENT",
              reducer: "",
              schema:
                "input EditFieldActionComponentInput {\n  fieldId: OID!\n  scopeType: ScopeType\n  scopeField: String\n  scopeDefaultValue: String\n  name: String\n  props: FieldScalarPropsInput\n}\n\ninput FieldScalarPropsInput {\n  string: StringFieldPropsInput\n  boolean: BooleanFieldPropsInput\n  number: NumberFieldPropsInput\n  oid: OIDFieldPropsInput\n  enum: EnumFieldPropsInput\n  button: ButtonFieldPropsInput\n}\n\ninput StringFieldPropsInput {\n  multiline: Boolean\n  placeholder: String\n  minLength: Int\n  maxLength: Int\n  description: String\n}\n\ninput BooleanFieldPropsInput {\n  isToggle: Boolean\n  optionalLabel: String\n  description: String\n}\n\ninput NumberFieldPropsInput {\n  placeholder: String\n  min: Int\n  max: Int\n  precision: Int\n}\n\ninput OIDFieldPropsInput {\n  placeholder: String\n  showIdField: Boolean\n}\n\ninput EnumFieldPropsInput {\n  placeholder: String\n  variant: EnumVariant\n  clearable: Boolean\n  searchable: Boolean\n}\n\ninput ButtonFieldPropsInput {\n  text: String\n  variant: ButtonVariant\n}",
              scope: "global",
              template: "",
            },
            {
              description:
                'Adds a new component of any type (action, input, content, group, or custom) to the schema. The component is inserted at the specified position or at the end. Components can be added to an existing group by specifying groupId. Adding a Custom component will generate a React .tsx file based on their name located on "./editors/custom-components" folder. For content components, the scopeDataType should be null if the scope is from a state field that is an array or object (custom type).',
              errors: [],
              examples: [],
              id: "e3760033-fa74-4edc-95f2-1dc1463c8ab3",
              name: "ADD_COMPONENT",
              reducer: "",
              schema:
                "input AddComponentInput {\n  id: OID!\n  type: EditorComponentType!\n  control: EditorComponentControl!\n  scope: String\n  scopeDataType: FieldDataType\n  name: String\n  groupId: OID\n  insertBefore: OID\n}\n",
              scope: "global",
              template: "",
            },
            {
              description:
                "Edits a content component that displays text or bound document state. Can update the label, static text, scope binding to document fields, data type, and formatting options (date format, number formatting, etc.). The contentFormat input uses ContentFormatInput which accepts partial updates - only the changed format properties need to be sent, and they will be merged with existing format values. The scopeDataType should be null if the scope is from a state field that is an array or object (custom type).",
              errors: [],
              examples: [],
              id: "e48e916c-15ad-44fd-a287-9294d3fc36e9",
              name: "EDIT_CONTENT_COMPONENT",
              reducer: "",
              schema:
                "input EditContentComponentInput {\n  id: OID!\n  label: String\n  control: EditorComponentControl\n  scope: String\n  scopeDataType: FieldDataType\n  text: String\n  contentFormat: ContentFormatInput\n}\n\ninput ContentFormatInput {\n  date: DateFormatInput\n  float: FloatFormatInput\n  int: IntFormatInput\n  boolean: BooleanFormatInput\n}\n\ninput DateFormatInput {\n  format: String\n}\n\ninput FloatFormatInput {\n  decimalPlaces: Int\n  unit: String\n}\n\ninput IntFormatInput {\n  unit: String\n}\n\ninput BooleanFormatInput {\n  showCheckbox: Boolean\n}",
              scope: "global",
              template: "",
            },
            {
              description:
                "Edits a custom component that references an external React component file. Can update the component name and file path. Every time the file path changes, a new custom component file is created. ",
              errors: [],
              examples: [],
              id: "9f5974cc-dde3-4eae-bbce-6b629966ff86",
              name: "EDIT_CUSTOM_COMPONENT",
              reducer: "",
              schema:
                "input EditCustomComponentInput {\n  id: OID!\n  name: String\n  path: String\n}",
              scope: "global",
              template: "",
            },
            {
              description:
                "Creates a new group component and moves the specified components into it. Groups allow you to control layout (row/column), gap spacing, and padding. The group is inserted at the specified position or at the end.",
              errors: [],
              examples: [],
              id: "357533aa-3a99-4864-965b-63127adb948d",
              name: "CREATE_GROUP",
              reducer: "",
              schema:
                "input CreateGroupInput {\n  id: OID!\n  componentIds:[OID!]!\n  insertBefore: OID\n}",
              scope: "global",
              template: "",
            },
            {
              description:
                "Adds existing components to an existing group. Components can be organised into groups for layout control (gap, padding, row/column). Components are moved from their current group (if any) to the target group. Cannot add action components (forms) inside another action component, even if there are groups in between. ",
              errors: [],
              examples: [],
              id: "cf7efee7-0299-41b3-a382-8aa7d4d3b98a",
              name: "ADD_TO_GROUP",
              reducer: "",
              schema:
                "input AddToGroupInput {\n  id: OID!\n  componentIds:[OID!]!\n}",
              scope: "global",
              template: "",
            },
            {
              description:
                "Removes components from a group. If the group becomes empty after removal, it is automatically deleted. Components removed from a group are moved to the parent group (if any) or become top-level components.",
              errors: [],
              examples: [],
              id: "1c97228b-5f08-4d2b-a783-764afdc9d401",
              name: "REMOVE_FROM_GROUP",
              reducer: "",
              schema:
                "input RemoveFromGroupInput {\n id: OID!\n  componentIds:[OID!]!\n}",
              scope: "global",
              template: "",
            },
            {
              description:
                "Edits group layout properties including layout direction (row/column), gap spacing between components, and padding (horizontal and vertical). Can be used on both group components and action components (which have an internal group for their fields or other components).",
              errors: [],
              examples: [],
              id: "7137088b-5d23-4f45-9d95-fb5030824b73",
              name: "EDIT_GROUP_COMPONENT",
              reducer: "",
              schema:
                "input EditGroupComponentInput {\n   id: OID!\n  layout: Layout\n  gap: Int\n  paddingTop: Int\n  paddingRight: Int\n  paddingBottom: Int\n  paddingLeft: Int\n  minWidth: Int\n  maxWidth: Int\n  minHeight: Int\n  maxHeight: Int\n  horizontalOrientation: HorizontalOrientation\n  verticalOrientation: VerticalOrientation\n}",
              scope: "global",
              template: "",
            },
            {
              description:
                "Edits a spacer component. Can update the width and height properties. If width or height are not provided, they remain unchanged.",
              errors: [],
              examples: [],
              id: "edit-spacer-component-operation-id",
              name: "EDIT_SPACER_COMPONENT",
              reducer:
                "state.schema = state.schema.map((component) =>\n  component.id === action.input.id\n    ? {\n        ...component,\n        config: {\n          ...(component.config as SpacerComponentConfig),\n          width:\n            action.input.width !== undefined\n              ? action.input.width ?? null\n              : (component.config as SpacerComponentConfig)?.width ?? null,\n          height:\n            action.input.height !== undefined\n              ? action.input.height ?? null\n              : (component.config as SpacerComponentConfig)?.height ?? null,\n        },\n      }\n    : component\n);",
              schema:
                "input EditSpacerComponentInput {\n  id: OID!\n  width: Int\n  height: Int\n}",
              scope: "global",
              template:
                "Edits a spacer component. Can update the width and height properties. If width or height are not provided, they remain unchanged.",
            },
          ],
        },
        {
          description: "",
          id: "2c52c2bb-2af8-4f06-85ca-c33d55f7975d",
          name: "schema",
          operations: [
            {
              description:
                "\u26A0\uFE0F WARNING: This operation completely replaces the entire schema with a new one and resets the theme to default values. It should only be used when you want to totally replace the schema. For normal component editing, use the specific component operations (ADD_COMPONENT, EDIT_COMPONENT, etc.) instead. For just clearing the schema without resetting theme, use RESET_SCHEMA.",
              errors: [],
              examples: [],
              id: "066e7160-3356-49c2-ad08-f0d3b274afcb",
              name: "SET_SCHEMA",
              reducer: "",
              schema:
                "input SetSchemaInput {\n  schema: [SchemaEditorComponent!]!\n}\n\ninput SchemaEditorComponent {\n  id: OID!\n}",
              scope: "global",
              template: "",
            },
            {
              description:
                "Resets the editor schema to an empty array, clearing all components, and resets the theme to default values. This is a safer alternative to SET_SCHEMA when you only want to clear the schema without providing replacement components.",
              errors: [],
              examples: [],
              id: "reset-schema-operation-id",
              name: "RESET_SCHEMA",
              reducer: "state.schema = [];",
              schema:
                "input ResetSchemaInput {\n  # Dummy field - RESET_SCHEMA operation takes no parameters, but GraphQL requires at least one field\n  _empty: Boolean\n}",
              scope: "global",
              template:
                "Resets the editor schema to an empty array, clearing all components. This is useful for starting fresh or completely replacing the editor structure.",
            },
          ],
        },
        {
          description: "",
          id: "6bfc2c83-735c-4064-866c-fc6ed0ef95b5",
          name: "theme",
          operations: [
            {
              description:
                "Updates the editor theme colors including primary color, background color, text color, and secondary text color. The theme has default values that are applied on first use if not already set.",
              errors: [],
              examples: [],
              id: "0b7ee9f8-2b62-43cf-9b61-957f1f14637f",
              name: "EDIT_THEME",
              reducer:
                "if (!state.theme) {\n  state.theme = {\n    primaryColor: null,\n    backgroundColor: null,\n    textColor: null,\n    secondaryTextColor: null,\n  };\n}\n\nif (action.input.primaryColor !== undefined) {\n  state.theme.primaryColor = (action.input.primaryColor ??\n    null) as string | null;\n}\nif (action.input.backgroundColor !== undefined) {\n  state.theme.backgroundColor = (action.input.backgroundColor ??\n    null) as string | null;\n}\nif (action.input.textColor !== undefined) {\n  state.theme.textColor = (action.input.textColor ?? null) as string | null;\n}\nif (action.input.secondaryTextColor !== undefined) {\n  state.theme.secondaryTextColor = (action.input.secondaryTextColor ??\n    null) as string | null;\n}",
              schema:
                "input EditThemeInput {\n primaryColor: String\n   backgroundColor: String\n   textColor: String\n   secondaryTextColor: String\n}\n",
              scope: "global",
              template: "",
            },
            {
              description:
                "Updates the root group properties for the document editor including layout, gap, padding, width/height constraints, and orientation settings.",
              errors: [],
              examples: [],
              id: "edit-root-group-props-operation-id",
              name: "EDIT_ROOT_GROUP_PROPS",
              reducer:
                'if (!state.groupProps) {\n  state.groupProps = {\n    layout: "column",\n    gap: 0,\n    paddingTop: 0,\n    paddingRight: 0,\n    paddingBottom: 0,\n    paddingLeft: 0,\n    minWidth: null,\n    maxWidth: null,\n    minHeight: null,\n    maxHeight: null,\n    horizontalOrientation: null,\n    verticalOrientation: null,\n  };\n}\nif (action.input.layout !== undefined) {\n  state.groupProps.layout = action.input.layout ?? "column";\n}\nif (action.input.gap !== undefined) {\n  state.groupProps.gap = action.input.gap ?? 0;\n}\nif (action.input.paddingTop !== undefined) {\n  state.groupProps.paddingTop = action.input.paddingTop ?? 0;\n}\nif (action.input.paddingRight !== undefined) {\n  state.groupProps.paddingRight = action.input.paddingRight ?? 0;\n}\nif (action.input.paddingBottom !== undefined) {\n  state.groupProps.paddingBottom = action.input.paddingBottom ?? 0;\n}\nif (action.input.paddingLeft !== undefined) {\n  state.groupProps.paddingLeft = action.input.paddingLeft ?? 0;\n}\nif (action.input.minWidth !== undefined) {\n  state.groupProps.minWidth = action.input.minWidth ?? null;\n}\nif (action.input.maxWidth !== undefined) {\n  state.groupProps.maxWidth = action.input.maxWidth ?? null;\n}\nif (action.input.minHeight !== undefined) {\n  state.groupProps.minHeight = action.input.minHeight ?? null;\n}\nif (action.input.maxHeight !== undefined) {\n  state.groupProps.maxHeight = action.input.maxHeight ?? null;\n}\nif (action.input.horizontalOrientation !== undefined) {\n  state.groupProps.horizontalOrientation = action.input.horizontalOrientation ?? null;\n}\nif (action.input.verticalOrientation !== undefined) {\n  state.groupProps.verticalOrientation = action.input.verticalOrientation ?? null;\n}',
              schema:
                "input EditRootGroupPropsInput {\n  layout: Layout\n  gap: Int\n  paddingTop: Int\n  paddingRight: Int\n  paddingBottom: Int\n  paddingLeft: Int\n  minWidth: Int\n  maxWidth: Int\n  minHeight: Int\n  maxHeight: Int\n  horizontalOrientation: HorizontalOrientation\n  verticalOrientation: VerticalOrientation\n}",
              scope: "global",
              template:
                "Updates the root group properties for the document editor including layout, gap, padding, width/height constraints, and orientation settings.",
            },
          ],
        },
      ],
      state: {
        global: {
          examples: [],
          initialValue:
            '{\n  "documentName": null,\n  "documentType": null,\n  "schema": [],\n  "theme": {\n    primaryColor: "#000000",\n    backgroundColor: "#FFFFFF00",\n    textColor: "#111827",\n    secondaryTextColor: "#6B7280"\n  },\n  "groupProps": {\n    layout: "column",\n    gap: 16,\n    paddingTop: 0,\n    paddingRight: 0,\n    paddingBottom: 0,\n    paddingLeft: 0,\n    minWidth: null,\n    maxWidth: null,\n    minHeight: null,\n    maxHeight: null,\n    horizontalOrientation: null,\n    verticalOrientation: null\n  }\n}',
          schema:
            "type DocumentEditorBuilderState {\n  documentName: String\n  documentType: String\n  schema: [EditorComponent!]!\n  theme: Theme\n  groupProps: GroupComponentConfig\n}\n\ntype Theme {\n  primaryColor: String\n  backgroundColor: String\n  textColor: String\n  secondaryTextColor: String\n}\n\ntype EditorComponent {\n  id: OID!\n  type: EditorComponentType!\n  control: EditorComponentControl!\n  config: EditorComponentConfig\n  groupId: OID\n}\n\nenum EditorComponentType {\n  action\n  input\n  content\n  group\n  custom\n  spacer\n}\n\nenum EditorComponentControl {\n  form\n  label\n  title\n  subtitle\n  paragraph\n  bulletList\n  input\n  group\n  custom\n  spacer\n}\n\nunion EditorComponentConfig =\n  | ActionComponentConfig\n  | InputComponentConfig\n  | ContentComponentConfig\n  | GroupComponentConfig\n  | CustomComponentConfig\n  | SpacerComponentConfig\n\ntype ActionComponentConfig {\n  action: ActionConfig\n  formProps: FormProps\n  group: GroupComponentConfig\n}\n\ntype InputComponentConfig {\n  field: ActionField!\n  actionId: OID!\n}\n\ntype ContentComponentConfig {\n  text: String\n  label: String\n  scope: String\n  scopeDataType: FieldDataType\n  contentFormat: ContentFormat\n}\n\ntype GroupComponentConfig {\n  layout: Layout!\n  gap: Int!\n  paddingTop: Int!\n  paddingRight: Int!\n  paddingBottom: Int!\n  paddingLeft: Int!\n  minWidth: Int\n  maxWidth: Int\n  minHeight: Int\n  maxHeight: Int\n  horizontalOrientation: HorizontalOrientation\n  verticalOrientation: VerticalOrientation\n}\n\ntype CustomComponentConfig {\n  name: String!\n  path: String!\n}\n\ntype SpacerComponentConfig {\n  width: Int\n  height: Int\n}\n\ntype ActionConfig {\n  id: OID!\n  name: String\n}\n\ntype FormProps {\n  trigger: CallbackTrigger\n  hasResetButton: Boolean\n}\n\ntype ActionField {\n  name: String\n  actionInput: String\n  scope: FieldScope!\n  dataType: FieldDataType\n  props: FieldScalarProps\n}\n\ntype FieldScope {\n  type: ScopeType!\n  defaultValue: String\n  field: String\n}\n\nenum ScopeType {\n  not_binded\n  binded\n  default_value\n  submit_button\n  reset_button\n}\n\nunion FieldScalarProps =\n  | StringFieldProps\n  | BooleanFieldProps\n  | NumberFieldProps\n  | OIDFieldProps\n  | EnumFieldProps\n  | ButtonFieldProps\n\ntype StringFieldProps {\n  multiline: Boolean\n  placeholder: String\n  minLength: Int\n  maxLength: Int\n  description: String\n}\ntype BooleanFieldProps {\n  isToggle: Boolean\n  optionalLabel: String\n  description: String\n}\ntype NumberFieldProps {\n  placeholder: String\n  min: Int\n  max: Int\n  precision: Int\n}\ntype OIDFieldProps {\n  placeholder: String\n  showIdField: Boolean\n}\ntype EnumFieldProps {\n  placeholder: String\n  variant: EnumVariant\n  clearable: Boolean\n  searchable: Boolean\n}\ntype ButtonFieldProps {\n  text: String\n  variant: ButtonVariant\n}\n\nenum EnumVariant {\n  auto\n  Select\n  RadioGroup\n}\n\nenum FieldDataType {\n  String\n  Int\n  Float\n  Amount\n  Currency\n  Boolean\n  Date\n  DateTime\n  EmailAddress\n  OID\n  Upload\n  Enum\n}\n\nenum CallbackTrigger {\n  onSubmit\n  onChange\n  onBlur\n}\n\nenum Layout {\n  column\n  row\n}\n\nenum HorizontalOrientation {\n  left\n  center\n  right\n}\n\nenum VerticalOrientation {\n  top\n  middle\n  bottom\n}\n\nenum ButtonVariant {\n  link\n  default\n  secondary\n  destructive\n  outline\n  ghost\n}\n\nunion ContentFormat = DateFormat | IntFormat | FloatFormat | BooleanFormat\n\ntype DateFormat {\n  format: String\n}\n\ntype FloatFormat {\n  decimalPlaces: Int\n  unit: String\n}\n\ntype IntFormat {\n  unit: String\n}\n\ntype BooleanFormat {\n  showCheckbox: Boolean\n}\n",
        },
        local: {
          examples: [],
          initialValue: "",
          schema: "",
        },
      },
      version: 1,
    },
  ],
};
