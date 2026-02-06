export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Address: { input: `${string}:0x${string}`; output: `${string}:0x${string}` };
  Amount: {
    input: { unit?: string; value?: number };
    output: { unit?: string; value?: number };
  };
  Amount_Crypto: {
    input: { unit: string; value: string };
    output: { unit: string; value: string };
  };
  Amount_Currency: {
    input: { unit: string; value: string };
    output: { unit: string; value: string };
  };
  Amount_Fiat: {
    input: { unit: string; value: number };
    output: { unit: string; value: number };
  };
  Amount_Money: { input: number; output: number };
  Amount_Percentage: { input: number; output: number };
  Amount_Tokens: { input: number; output: number };
  Attachment: { input: string; output: string };
  Currency: { input: string; output: string };
  Date: { input: string; output: string };
  DateTime: { input: string; output: string };
  EmailAddress: { input: string; output: string };
  EthereumAddress: { input: string; output: string };
  OID: { input: string; output: string };
  OLabel: { input: string; output: string };
  PHID: { input: string; output: string };
  URL: { input: string; output: string };
  Unknown: { input: unknown; output: unknown };
  Upload: { input: File; output: File };
};

export type ActionComponentConfig = {
  action: Maybe<ActionConfig>;
  formProps: Maybe<FormProps>;
  group: Maybe<GroupComponentConfig>;
};

export type ActionConfig = {
  id: Scalars["OID"]["output"];
  name: Maybe<Scalars["String"]["output"]>;
};

export type ActionField = {
  actionInput: Maybe<Scalars["String"]["output"]>;
  dataType: Maybe<FieldDataType>;
  name: Maybe<Scalars["String"]["output"]>;
  props: Maybe<FieldScalarProps>;
  scope: FieldScope;
};

export type AddActionComponentInput = {
  actionId: Scalars["OID"]["input"];
  actionName: Scalars["String"]["input"];
  control?: InputMaybe<EditorComponentControl>;
  id: Scalars["OID"]["input"];
  initialFields: Array<AddEditorActionFieldInput>;
  insertBefore?: InputMaybe<Scalars["OID"]["input"]>;
  trigger?: InputMaybe<CallbackTrigger>;
};

export type AddComponentInput = {
  control: EditorComponentControl;
  groupId?: InputMaybe<Scalars["OID"]["input"]>;
  id: Scalars["OID"]["input"];
  insertBefore?: InputMaybe<Scalars["OID"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  scope?: InputMaybe<Scalars["String"]["input"]>;
  scopeDataType?: InputMaybe<FieldDataType>;
  type: EditorComponentType;
};

export type AddEditorActionFieldInput = {
  actionInput?: InputMaybe<Scalars["String"]["input"]>;
  dataType?: InputMaybe<FieldDataType>;
  id: Scalars["OID"]["input"];
  scope?: InputMaybe<Scalars["String"]["input"]>;
};

export type AddToGroupInput = {
  componentIds: Array<Scalars["OID"]["input"]>;
  id: Scalars["OID"]["input"];
};

export type BooleanFieldProps = {
  description: Maybe<Scalars["String"]["output"]>;
  isToggle: Maybe<Scalars["Boolean"]["output"]>;
  optionalLabel: Maybe<Scalars["String"]["output"]>;
};

export type BooleanFieldPropsInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  isToggle?: InputMaybe<Scalars["Boolean"]["input"]>;
  optionalLabel?: InputMaybe<Scalars["String"]["input"]>;
};

export type BooleanFormat = {
  showCheckbox: Maybe<Scalars["Boolean"]["output"]>;
};

export type BooleanFormatInput = {
  showCheckbox?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type ButtonFieldProps = {
  text: Maybe<Scalars["String"]["output"]>;
  variant: Maybe<ButtonVariant>;
};

export type ButtonFieldPropsInput = {
  text?: InputMaybe<Scalars["String"]["input"]>;
  variant?: InputMaybe<ButtonVariant>;
};

export type ButtonVariant =
  | "default"
  | "destructive"
  | "ghost"
  | "link"
  | "outline"
  | "secondary";

export type CallbackTrigger = "onBlur" | "onChange" | "onSubmit";

export type ContentComponentConfig = {
  contentFormat: Maybe<ContentFormat>;
  label: Maybe<Scalars["String"]["output"]>;
  scope: Maybe<Scalars["String"]["output"]>;
  scopeDataType: Maybe<FieldDataType>;
  text: Maybe<Scalars["String"]["output"]>;
};

export type ContentFormat =
  | BooleanFormat
  | DateFormat
  | FloatFormat
  | IntFormat;

export type ContentFormatInput = {
  boolean?: InputMaybe<BooleanFormatInput>;
  date?: InputMaybe<DateFormatInput>;
  float?: InputMaybe<FloatFormatInput>;
  int?: InputMaybe<IntFormatInput>;
};

export type CreateGroupInput = {
  componentIds: Array<Scalars["OID"]["input"]>;
  id: Scalars["OID"]["input"];
  insertBefore?: InputMaybe<Scalars["OID"]["input"]>;
};

export type CustomComponentConfig = {
  name: Scalars["String"]["output"];
  path: Scalars["String"]["output"];
};

export type DateFormat = {
  format: Maybe<Scalars["String"]["output"]>;
};

export type DateFormatInput = {
  format?: InputMaybe<Scalars["String"]["input"]>;
};

export type DocumentEditorBuilderState = {
  documentName: Maybe<Scalars["String"]["output"]>;
  documentType: Maybe<Scalars["String"]["output"]>;
  groupProps: Maybe<GroupComponentConfig>;
  schema: Array<EditorComponent>;
  theme: Maybe<Theme>;
};

export type EditActionComponentInput = {
  actionId?: InputMaybe<Scalars["OID"]["input"]>;
  actionName?: InputMaybe<Scalars["String"]["input"]>;
  control?: InputMaybe<Scalars["String"]["input"]>;
  fields?: InputMaybe<Array<EditEditorActionFieldInput>>;
  hasResetButton?: InputMaybe<Scalars["Boolean"]["input"]>;
  id: Scalars["OID"]["input"];
  trigger?: InputMaybe<CallbackTrigger>;
};

export type EditContentComponentInput = {
  contentFormat?: InputMaybe<ContentFormatInput>;
  control?: InputMaybe<EditorComponentControl>;
  id: Scalars["OID"]["input"];
  label?: InputMaybe<Scalars["String"]["input"]>;
  scope?: InputMaybe<Scalars["String"]["input"]>;
  scopeDataType?: InputMaybe<FieldDataType>;
  text?: InputMaybe<Scalars["String"]["input"]>;
};

export type EditCustomComponentInput = {
  id: Scalars["OID"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
  path?: InputMaybe<Scalars["String"]["input"]>;
};

export type EditEditorActionFieldInput = {
  actionInput?: InputMaybe<Scalars["String"]["input"]>;
  dataType?: InputMaybe<FieldDataType>;
  id: Scalars["OID"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
  scope?: InputMaybe<Scalars["String"]["input"]>;
};

export type EditFieldActionComponentInput = {
  fieldId: Scalars["OID"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
  props?: InputMaybe<FieldScalarPropsInput>;
  scopeDefaultValue?: InputMaybe<Scalars["String"]["input"]>;
  scopeField?: InputMaybe<Scalars["String"]["input"]>;
  scopeType?: InputMaybe<ScopeType>;
};

export type EditGroupComponentInput = {
  gap?: InputMaybe<Scalars["Int"]["input"]>;
  horizontalOrientation?: InputMaybe<HorizontalOrientation>;
  id: Scalars["OID"]["input"];
  layout?: InputMaybe<Layout>;
  maxHeight?: InputMaybe<Scalars["Int"]["input"]>;
  maxWidth?: InputMaybe<Scalars["Int"]["input"]>;
  minHeight?: InputMaybe<Scalars["Int"]["input"]>;
  minWidth?: InputMaybe<Scalars["Int"]["input"]>;
  paddingBottom?: InputMaybe<Scalars["Int"]["input"]>;
  paddingLeft?: InputMaybe<Scalars["Int"]["input"]>;
  paddingRight?: InputMaybe<Scalars["Int"]["input"]>;
  paddingTop?: InputMaybe<Scalars["Int"]["input"]>;
  verticalOrientation?: InputMaybe<VerticalOrientation>;
};

export type EditRootGroupPropsInput = {
  gap?: InputMaybe<Scalars["Int"]["input"]>;
  horizontalOrientation?: InputMaybe<HorizontalOrientation>;
  layout?: InputMaybe<Layout>;
  maxHeight?: InputMaybe<Scalars["Int"]["input"]>;
  maxWidth?: InputMaybe<Scalars["Int"]["input"]>;
  minHeight?: InputMaybe<Scalars["Int"]["input"]>;
  minWidth?: InputMaybe<Scalars["Int"]["input"]>;
  paddingBottom?: InputMaybe<Scalars["Int"]["input"]>;
  paddingLeft?: InputMaybe<Scalars["Int"]["input"]>;
  paddingRight?: InputMaybe<Scalars["Int"]["input"]>;
  paddingTop?: InputMaybe<Scalars["Int"]["input"]>;
  verticalOrientation?: InputMaybe<VerticalOrientation>;
};

export type EditSpacerComponentInput = {
  height?: InputMaybe<Scalars["Int"]["input"]>;
  id: Scalars["OID"]["input"];
  width?: InputMaybe<Scalars["Int"]["input"]>;
};

export type EditThemeInput = {
  backgroundColor?: InputMaybe<Scalars["String"]["input"]>;
  primaryColor?: InputMaybe<Scalars["String"]["input"]>;
  secondaryTextColor?: InputMaybe<Scalars["String"]["input"]>;
  textColor?: InputMaybe<Scalars["String"]["input"]>;
};

export type EditorComponent = {
  config: Maybe<EditorComponentConfig>;
  control: EditorComponentControl;
  groupId: Maybe<Scalars["OID"]["output"]>;
  id: Scalars["OID"]["output"];
  type: EditorComponentType;
};

export type EditorComponentConfig =
  | ActionComponentConfig
  | ContentComponentConfig
  | CustomComponentConfig
  | GroupComponentConfig
  | InputComponentConfig
  | SpacerComponentConfig;

export type EditorComponentControl =
  | "bulletList"
  | "custom"
  | "form"
  | "group"
  | "input"
  | "label"
  | "paragraph"
  | "spacer"
  | "subtitle"
  | "title";

export type EditorComponentType =
  | "action"
  | "content"
  | "custom"
  | "group"
  | "input"
  | "spacer";

export type EnumFieldProps = {
  clearable: Maybe<Scalars["Boolean"]["output"]>;
  placeholder: Maybe<Scalars["String"]["output"]>;
  searchable: Maybe<Scalars["Boolean"]["output"]>;
  variant: Maybe<EnumVariant>;
};

export type EnumFieldPropsInput = {
  clearable?: InputMaybe<Scalars["Boolean"]["input"]>;
  placeholder?: InputMaybe<Scalars["String"]["input"]>;
  searchable?: InputMaybe<Scalars["Boolean"]["input"]>;
  variant?: InputMaybe<EnumVariant>;
};

export type EnumVariant = "RadioGroup" | "Select" | "auto";

export type FieldDataType =
  | "Amount"
  | "Boolean"
  | "Currency"
  | "Date"
  | "DateTime"
  | "EmailAddress"
  | "Enum"
  | "Float"
  | "Int"
  | "OID"
  | "String"
  | "Upload";

export type FieldScalarProps =
  | BooleanFieldProps
  | ButtonFieldProps
  | EnumFieldProps
  | NumberFieldProps
  | OidFieldProps
  | StringFieldProps;

export type FieldScalarPropsInput = {
  boolean?: InputMaybe<BooleanFieldPropsInput>;
  button?: InputMaybe<ButtonFieldPropsInput>;
  enum?: InputMaybe<EnumFieldPropsInput>;
  number?: InputMaybe<NumberFieldPropsInput>;
  oid?: InputMaybe<OidFieldPropsInput>;
  string?: InputMaybe<StringFieldPropsInput>;
};

export type FieldScope = {
  defaultValue: Maybe<Scalars["String"]["output"]>;
  field: Maybe<Scalars["String"]["output"]>;
  type: ScopeType;
};

export type FloatFormat = {
  decimalPlaces: Maybe<Scalars["Int"]["output"]>;
  unit: Maybe<Scalars["String"]["output"]>;
};

export type FloatFormatInput = {
  decimalPlaces?: InputMaybe<Scalars["Int"]["input"]>;
  unit?: InputMaybe<Scalars["String"]["input"]>;
};

export type FormProps = {
  hasResetButton: Maybe<Scalars["Boolean"]["output"]>;
  trigger: Maybe<CallbackTrigger>;
};

export type GroupComponentConfig = {
  gap: Scalars["Int"]["output"];
  horizontalOrientation: Maybe<HorizontalOrientation>;
  layout: Layout;
  maxHeight: Maybe<Scalars["Int"]["output"]>;
  maxWidth: Maybe<Scalars["Int"]["output"]>;
  minHeight: Maybe<Scalars["Int"]["output"]>;
  minWidth: Maybe<Scalars["Int"]["output"]>;
  paddingBottom: Scalars["Int"]["output"];
  paddingLeft: Scalars["Int"]["output"];
  paddingRight: Scalars["Int"]["output"];
  paddingTop: Scalars["Int"]["output"];
  verticalOrientation: Maybe<VerticalOrientation>;
};

export type HorizontalOrientation = "center" | "left" | "right";

export type InputComponentConfig = {
  actionId: Scalars["OID"]["output"];
  field: ActionField;
};

export type IntFormat = {
  unit: Maybe<Scalars["String"]["output"]>;
};

export type IntFormatInput = {
  unit?: InputMaybe<Scalars["String"]["input"]>;
};

export type Layout = "column" | "row";

export type NumberFieldProps = {
  max: Maybe<Scalars["Int"]["output"]>;
  min: Maybe<Scalars["Int"]["output"]>;
  placeholder: Maybe<Scalars["String"]["output"]>;
  precision: Maybe<Scalars["Int"]["output"]>;
};

export type NumberFieldPropsInput = {
  max?: InputMaybe<Scalars["Int"]["input"]>;
  min?: InputMaybe<Scalars["Int"]["input"]>;
  placeholder?: InputMaybe<Scalars["String"]["input"]>;
  precision?: InputMaybe<Scalars["Int"]["input"]>;
};

export type OidFieldProps = {
  placeholder: Maybe<Scalars["String"]["output"]>;
  showIdField: Maybe<Scalars["Boolean"]["output"]>;
};

export type OidFieldPropsInput = {
  placeholder?: InputMaybe<Scalars["String"]["input"]>;
  showIdField?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type RemoveComponentInput = {
  componentId: Scalars["OID"]["input"];
};

export type RemoveFromGroupInput = {
  componentIds: Array<Scalars["OID"]["input"]>;
  id: Scalars["OID"]["input"];
};

export type ReorderComponentsInput = {
  components: Array<Scalars["OID"]["input"]>;
  insertBefore?: InputMaybe<Scalars["OID"]["input"]>;
};

export type ResetSchemaInput = {
  _empty?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type SchemaEditorComponent = {
  id: Scalars["OID"]["input"];
};

export type ScopeType =
  | "binded"
  | "default_value"
  | "not_binded"
  | "reset_button"
  | "submit_button";

export type SetDocumentTypeInput = {
  documentName?: InputMaybe<Scalars["String"]["input"]>;
  documentType?: InputMaybe<Scalars["String"]["input"]>;
};

export type SetNewDocumentNameInput = {
  name: Scalars["String"]["input"];
};

export type SetSchemaInput = {
  schema: Array<SchemaEditorComponent>;
};

export type SpacerComponentConfig = {
  height: Maybe<Scalars["Int"]["output"]>;
  width: Maybe<Scalars["Int"]["output"]>;
};

export type StringFieldProps = {
  description: Maybe<Scalars["String"]["output"]>;
  maxLength: Maybe<Scalars["Int"]["output"]>;
  minLength: Maybe<Scalars["Int"]["output"]>;
  multiline: Maybe<Scalars["Boolean"]["output"]>;
  placeholder: Maybe<Scalars["String"]["output"]>;
};

export type StringFieldPropsInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  maxLength?: InputMaybe<Scalars["Int"]["input"]>;
  minLength?: InputMaybe<Scalars["Int"]["input"]>;
  multiline?: InputMaybe<Scalars["Boolean"]["input"]>;
  placeholder?: InputMaybe<Scalars["String"]["input"]>;
};

export type Theme = {
  backgroundColor: Maybe<Scalars["String"]["output"]>;
  primaryColor: Maybe<Scalars["String"]["output"]>;
  secondaryTextColor: Maybe<Scalars["String"]["output"]>;
  textColor: Maybe<Scalars["String"]["output"]>;
};

export type VerticalOrientation = "bottom" | "middle" | "top";
