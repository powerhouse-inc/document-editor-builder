import * as z from "zod";
import type {
  ActionComponentConfig,
  ActionConfig,
  ActionField,
  AddActionComponentInput,
  AddComponentInput,
  AddEditorActionFieldInput,
  AddToGroupInput,
  BooleanFieldProps,
  BooleanFieldPropsInput,
  BooleanFormat,
  BooleanFormatInput,
  ButtonFieldProps,
  ButtonFieldPropsInput,
  ButtonVariant,
  CallbackTrigger,
  ContentComponentConfig,
  ContentFormatInput,
  CreateGroupInput,
  CustomComponentConfig,
  DateFormat,
  DateFormatInput,
  DocumentEditorBuilderState,
  EditActionComponentInput,
  EditContentComponentInput,
  EditCustomComponentInput,
  EditEditorActionFieldInput,
  EditFieldActionComponentInput,
  EditGroupComponentInput,
  EditRootGroupPropsInput,
  EditSpacerComponentInput,
  EditThemeInput,
  EditorComponent,
  EditorComponentControl,
  EditorComponentType,
  EnumFieldProps,
  EnumFieldPropsInput,
  EnumVariant,
  FieldDataType,
  FieldScalarPropsInput,
  FieldScope,
  FloatFormat,
  FloatFormatInput,
  FormProps,
  GroupComponentConfig,
  HorizontalOrientation,
  InputComponentConfig,
  IntFormat,
  IntFormatInput,
  Layout,
  NumberFieldProps,
  NumberFieldPropsInput,
  OidFieldProps,
  OidFieldPropsInput,
  RemoveComponentInput,
  RemoveFromGroupInput,
  ReorderComponentsInput,
  ResetSchemaInput,
  SchemaEditorComponent,
  ScopeType,
  SetDocumentTypeInput,
  SetNewDocumentNameInput,
  SetSchemaInput,
  SpacerComponentConfig,
  StringFieldProps,
  StringFieldPropsInput,
  Theme,
  VerticalOrientation,
} from "./types.js";

type Properties<T> = Required<{
  [K in keyof T]: z.ZodType<T[K]>;
}>;

type definedNonNullAny = {};

export const isDefinedNonNullAny = (v: any): v is definedNonNullAny =>
  v !== undefined && v !== null;

export const definedNonNullAnySchema = z
  .any()
  .refine((v) => isDefinedNonNullAny(v));

export const ButtonVariantSchema = z.enum([
  "default",
  "destructive",
  "ghost",
  "link",
  "outline",
  "secondary",
]);

export const CallbackTriggerSchema = z.enum(["onBlur", "onChange", "onSubmit"]);

export const EditorComponentControlSchema = z.enum([
  "bulletList",
  "custom",
  "form",
  "group",
  "input",
  "label",
  "paragraph",
  "spacer",
  "subtitle",
  "title",
]);

export const EditorComponentTypeSchema = z.enum([
  "action",
  "content",
  "custom",
  "group",
  "input",
  "spacer",
]);

export const EnumVariantSchema = z.enum(["RadioGroup", "Select", "auto"]);

export const FieldDataTypeSchema = z.enum([
  "Amount",
  "Boolean",
  "Currency",
  "Date",
  "DateTime",
  "EmailAddress",
  "Enum",
  "Float",
  "Int",
  "OID",
  "String",
  "Upload",
]);

export const HorizontalOrientationSchema = z.enum(["center", "left", "right"]);

export const LayoutSchema = z.enum(["column", "row"]);

export const ScopeTypeSchema = z.enum([
  "binded",
  "default_value",
  "not_binded",
  "reset_button",
  "submit_button",
]);

export const VerticalOrientationSchema = z.enum(["bottom", "middle", "top"]);

export function ActionComponentConfigSchema(): z.ZodObject<
  Properties<ActionComponentConfig>
> {
  return z.object({
    __typename: z.literal("ActionComponentConfig").optional(),
    action: z.lazy(() => ActionConfigSchema().nullish()),
    formProps: z.lazy(() => FormPropsSchema().nullish()),
    group: z.lazy(() => GroupComponentConfigSchema().nullish()),
  });
}

export function ActionConfigSchema(): z.ZodObject<Properties<ActionConfig>> {
  return z.object({
    __typename: z.literal("ActionConfig").optional(),
    id: z.string(),
    name: z.string().nullish(),
  });
}

export function ActionFieldSchema(): z.ZodObject<Properties<ActionField>> {
  return z.object({
    __typename: z.literal("ActionField").optional(),
    actionInput: z.string().nullish(),
    dataType: FieldDataTypeSchema.nullish(),
    name: z.string().nullish(),
    props: z.lazy(() => FieldScalarPropsSchema().nullish()),
    scope: z.lazy(() => FieldScopeSchema()),
  });
}

export function AddActionComponentInputSchema(): z.ZodObject<
  Properties<AddActionComponentInput>
> {
  return z.object({
    actionId: z.string(),
    actionName: z.string(),
    control: EditorComponentControlSchema.nullish(),
    id: z.string(),
    initialFields: z.array(z.lazy(() => AddEditorActionFieldInputSchema())),
    insertBefore: z.string().nullish(),
    trigger: CallbackTriggerSchema.nullish(),
  });
}

export function AddComponentInputSchema(): z.ZodObject<
  Properties<AddComponentInput>
> {
  return z.object({
    control: EditorComponentControlSchema,
    groupId: z.string().nullish(),
    id: z.string(),
    insertBefore: z.string().nullish(),
    name: z.string().nullish(),
    scope: z.string().nullish(),
    scopeDataType: FieldDataTypeSchema.nullish(),
    type: EditorComponentTypeSchema,
  });
}

export function AddEditorActionFieldInputSchema(): z.ZodObject<
  Properties<AddEditorActionFieldInput>
> {
  return z.object({
    actionInput: z.string().nullish(),
    dataType: FieldDataTypeSchema.nullish(),
    id: z.string(),
    scope: z.string().nullish(),
  });
}

export function AddToGroupInputSchema(): z.ZodObject<
  Properties<AddToGroupInput>
> {
  return z.object({
    componentIds: z.array(z.string()),
    id: z.string(),
  });
}

export function BooleanFieldPropsSchema(): z.ZodObject<
  Properties<BooleanFieldProps>
> {
  return z.object({
    __typename: z.literal("BooleanFieldProps").optional(),
    description: z.string().nullish(),
    isToggle: z.boolean().nullish(),
    optionalLabel: z.string().nullish(),
  });
}

export function BooleanFieldPropsInputSchema(): z.ZodObject<
  Properties<BooleanFieldPropsInput>
> {
  return z.object({
    description: z.string().nullish(),
    isToggle: z.boolean().nullish(),
    optionalLabel: z.string().nullish(),
  });
}

export function BooleanFormatSchema(): z.ZodObject<Properties<BooleanFormat>> {
  return z.object({
    __typename: z.literal("BooleanFormat").optional(),
    showCheckbox: z.boolean().nullish(),
  });
}

export function BooleanFormatInputSchema(): z.ZodObject<
  Properties<BooleanFormatInput>
> {
  return z.object({
    showCheckbox: z.boolean().nullish(),
  });
}

export function ButtonFieldPropsSchema(): z.ZodObject<
  Properties<ButtonFieldProps>
> {
  return z.object({
    __typename: z.literal("ButtonFieldProps").optional(),
    text: z.string().nullish(),
    variant: ButtonVariantSchema.nullish(),
  });
}

export function ButtonFieldPropsInputSchema(): z.ZodObject<
  Properties<ButtonFieldPropsInput>
> {
  return z.object({
    text: z.string().nullish(),
    variant: ButtonVariantSchema.nullish(),
  });
}

export function ContentComponentConfigSchema(): z.ZodObject<
  Properties<ContentComponentConfig>
> {
  return z.object({
    __typename: z.literal("ContentComponentConfig").optional(),
    contentFormat: z.lazy(() => ContentFormatSchema().nullish()),
    label: z.string().nullish(),
    scope: z.string().nullish(),
    scopeDataType: FieldDataTypeSchema.nullish(),
    text: z.string().nullish(),
  });
}

export function ContentFormatSchema() {
  return z.union([
    BooleanFormatSchema(),
    DateFormatSchema(),
    FloatFormatSchema(),
    IntFormatSchema(),
  ]);
}

export function ContentFormatInputSchema(): z.ZodObject<
  Properties<ContentFormatInput>
> {
  return z.object({
    boolean: z.lazy(() => BooleanFormatInputSchema().nullish()),
    date: z.lazy(() => DateFormatInputSchema().nullish()),
    float: z.lazy(() => FloatFormatInputSchema().nullish()),
    int: z.lazy(() => IntFormatInputSchema().nullish()),
  });
}

export function CreateGroupInputSchema(): z.ZodObject<
  Properties<CreateGroupInput>
> {
  return z.object({
    componentIds: z.array(z.string()),
    id: z.string(),
    insertBefore: z.string().nullish(),
  });
}

export function CustomComponentConfigSchema(): z.ZodObject<
  Properties<CustomComponentConfig>
> {
  return z.object({
    __typename: z.literal("CustomComponentConfig").optional(),
    name: z.string(),
    path: z.string(),
  });
}

export function DateFormatSchema(): z.ZodObject<Properties<DateFormat>> {
  return z.object({
    __typename: z.literal("DateFormat").optional(),
    format: z.string().nullish(),
  });
}

export function DateFormatInputSchema(): z.ZodObject<
  Properties<DateFormatInput>
> {
  return z.object({
    format: z.string().nullish(),
  });
}

export function DocumentEditorBuilderStateSchema(): z.ZodObject<
  Properties<DocumentEditorBuilderState>
> {
  return z.object({
    __typename: z.literal("DocumentEditorBuilderState").optional(),
    documentName: z.string().nullish(),
    documentType: z.string().nullish(),
    groupProps: z.lazy(() => GroupComponentConfigSchema().nullish()),
    schema: z.array(z.lazy(() => EditorComponentSchema())),
    theme: z.lazy(() => ThemeSchema().nullish()),
  });
}

export function EditActionComponentInputSchema(): z.ZodObject<
  Properties<EditActionComponentInput>
> {
  return z.object({
    actionId: z.string().nullish(),
    actionName: z.string().nullish(),
    control: z.string().nullish(),
    fields: z.array(z.lazy(() => EditEditorActionFieldInputSchema())).nullish(),
    hasResetButton: z.boolean().nullish(),
    id: z.string(),
    trigger: CallbackTriggerSchema.nullish(),
  });
}

export function EditContentComponentInputSchema(): z.ZodObject<
  Properties<EditContentComponentInput>
> {
  return z.object({
    contentFormat: z.lazy(() => ContentFormatInputSchema().nullish()),
    control: EditorComponentControlSchema.nullish(),
    id: z.string(),
    label: z.string().nullish(),
    scope: z.string().nullish(),
    scopeDataType: FieldDataTypeSchema.nullish(),
    text: z.string().nullish(),
  });
}

export function EditCustomComponentInputSchema(): z.ZodObject<
  Properties<EditCustomComponentInput>
> {
  return z.object({
    id: z.string(),
    name: z.string().nullish(),
    path: z.string().nullish(),
  });
}

export function EditEditorActionFieldInputSchema(): z.ZodObject<
  Properties<EditEditorActionFieldInput>
> {
  return z.object({
    actionInput: z.string().nullish(),
    dataType: FieldDataTypeSchema.nullish(),
    id: z.string(),
    name: z.string().nullish(),
    scope: z.string().nullish(),
  });
}

export function EditFieldActionComponentInputSchema(): z.ZodObject<
  Properties<EditFieldActionComponentInput>
> {
  return z.object({
    fieldId: z.string(),
    name: z.string().nullish(),
    props: z.lazy(() => FieldScalarPropsInputSchema().nullish()),
    scopeDefaultValue: z.string().nullish(),
    scopeField: z.string().nullish(),
    scopeType: ScopeTypeSchema.nullish(),
  });
}

export function EditGroupComponentInputSchema(): z.ZodObject<
  Properties<EditGroupComponentInput>
> {
  return z.object({
    gap: z.number().nullish(),
    horizontalOrientation: HorizontalOrientationSchema.nullish(),
    id: z.string(),
    layout: LayoutSchema.nullish(),
    maxHeight: z.number().nullish(),
    maxWidth: z.number().nullish(),
    minHeight: z.number().nullish(),
    minWidth: z.number().nullish(),
    paddingBottom: z.number().nullish(),
    paddingLeft: z.number().nullish(),
    paddingRight: z.number().nullish(),
    paddingTop: z.number().nullish(),
    verticalOrientation: VerticalOrientationSchema.nullish(),
  });
}

export function EditRootGroupPropsInputSchema(): z.ZodObject<
  Properties<EditRootGroupPropsInput>
> {
  return z.object({
    gap: z.number().nullish(),
    horizontalOrientation: HorizontalOrientationSchema.nullish(),
    layout: LayoutSchema.nullish(),
    maxHeight: z.number().nullish(),
    maxWidth: z.number().nullish(),
    minHeight: z.number().nullish(),
    minWidth: z.number().nullish(),
    paddingBottom: z.number().nullish(),
    paddingLeft: z.number().nullish(),
    paddingRight: z.number().nullish(),
    paddingTop: z.number().nullish(),
    verticalOrientation: VerticalOrientationSchema.nullish(),
  });
}

export function EditSpacerComponentInputSchema(): z.ZodObject<
  Properties<EditSpacerComponentInput>
> {
  return z.object({
    height: z.number().nullish(),
    id: z.string(),
    width: z.number().nullish(),
  });
}

export function EditThemeInputSchema(): z.ZodObject<
  Properties<EditThemeInput>
> {
  return z.object({
    backgroundColor: z.string().nullish(),
    primaryColor: z.string().nullish(),
    secondaryTextColor: z.string().nullish(),
    textColor: z.string().nullish(),
  });
}

export function EditorComponentSchema(): z.ZodObject<
  Properties<EditorComponent>
> {
  return z.object({
    __typename: z.literal("EditorComponent").optional(),
    config: z.lazy(() => EditorComponentConfigSchema().nullish()),
    control: EditorComponentControlSchema,
    groupId: z.string().nullish(),
    id: z.string(),
    type: EditorComponentTypeSchema,
  });
}

export function EditorComponentConfigSchema() {
  return z.union([
    ActionComponentConfigSchema(),
    ContentComponentConfigSchema(),
    CustomComponentConfigSchema(),
    GroupComponentConfigSchema(),
    InputComponentConfigSchema(),
    SpacerComponentConfigSchema(),
  ]);
}

export function EnumFieldPropsSchema(): z.ZodObject<
  Properties<EnumFieldProps>
> {
  return z.object({
    __typename: z.literal("EnumFieldProps").optional(),
    clearable: z.boolean().nullish(),
    placeholder: z.string().nullish(),
    searchable: z.boolean().nullish(),
    variant: EnumVariantSchema.nullish(),
  });
}

export function EnumFieldPropsInputSchema(): z.ZodObject<
  Properties<EnumFieldPropsInput>
> {
  return z.object({
    clearable: z.boolean().nullish(),
    placeholder: z.string().nullish(),
    searchable: z.boolean().nullish(),
    variant: EnumVariantSchema.nullish(),
  });
}

export function FieldScalarPropsSchema() {
  return z.union([
    BooleanFieldPropsSchema(),
    ButtonFieldPropsSchema(),
    EnumFieldPropsSchema(),
    NumberFieldPropsSchema(),
    OidFieldPropsSchema(),
    StringFieldPropsSchema(),
  ]);
}

export function FieldScalarPropsInputSchema(): z.ZodObject<
  Properties<FieldScalarPropsInput>
> {
  return z.object({
    boolean: z.lazy(() => BooleanFieldPropsInputSchema().nullish()),
    button: z.lazy(() => ButtonFieldPropsInputSchema().nullish()),
    enum: z.lazy(() => EnumFieldPropsInputSchema().nullish()),
    number: z.lazy(() => NumberFieldPropsInputSchema().nullish()),
    oid: z.lazy(() => OidFieldPropsInputSchema().nullish()),
    string: z.lazy(() => StringFieldPropsInputSchema().nullish()),
  });
}

export function FieldScopeSchema(): z.ZodObject<Properties<FieldScope>> {
  return z.object({
    __typename: z.literal("FieldScope").optional(),
    defaultValue: z.string().nullish(),
    field: z.string().nullish(),
    type: ScopeTypeSchema,
  });
}

export function FloatFormatSchema(): z.ZodObject<Properties<FloatFormat>> {
  return z.object({
    __typename: z.literal("FloatFormat").optional(),
    decimalPlaces: z.number().nullish(),
    unit: z.string().nullish(),
  });
}

export function FloatFormatInputSchema(): z.ZodObject<
  Properties<FloatFormatInput>
> {
  return z.object({
    decimalPlaces: z.number().nullish(),
    unit: z.string().nullish(),
  });
}

export function FormPropsSchema(): z.ZodObject<Properties<FormProps>> {
  return z.object({
    __typename: z.literal("FormProps").optional(),
    hasResetButton: z.boolean().nullish(),
    trigger: CallbackTriggerSchema.nullish(),
  });
}

export function GroupComponentConfigSchema(): z.ZodObject<
  Properties<GroupComponentConfig>
> {
  return z.object({
    __typename: z.literal("GroupComponentConfig").optional(),
    gap: z.number(),
    horizontalOrientation: HorizontalOrientationSchema.nullish(),
    layout: LayoutSchema,
    maxHeight: z.number().nullish(),
    maxWidth: z.number().nullish(),
    minHeight: z.number().nullish(),
    minWidth: z.number().nullish(),
    paddingBottom: z.number(),
    paddingLeft: z.number(),
    paddingRight: z.number(),
    paddingTop: z.number(),
    verticalOrientation: VerticalOrientationSchema.nullish(),
  });
}

export function InputComponentConfigSchema(): z.ZodObject<
  Properties<InputComponentConfig>
> {
  return z.object({
    __typename: z.literal("InputComponentConfig").optional(),
    actionId: z.string(),
    field: z.lazy(() => ActionFieldSchema()),
  });
}

export function IntFormatSchema(): z.ZodObject<Properties<IntFormat>> {
  return z.object({
    __typename: z.literal("IntFormat").optional(),
    unit: z.string().nullish(),
  });
}

export function IntFormatInputSchema(): z.ZodObject<
  Properties<IntFormatInput>
> {
  return z.object({
    unit: z.string().nullish(),
  });
}

export function NumberFieldPropsSchema(): z.ZodObject<
  Properties<NumberFieldProps>
> {
  return z.object({
    __typename: z.literal("NumberFieldProps").optional(),
    max: z.number().nullish(),
    min: z.number().nullish(),
    placeholder: z.string().nullish(),
    precision: z.number().nullish(),
  });
}

export function NumberFieldPropsInputSchema(): z.ZodObject<
  Properties<NumberFieldPropsInput>
> {
  return z.object({
    max: z.number().nullish(),
    min: z.number().nullish(),
    placeholder: z.string().nullish(),
    precision: z.number().nullish(),
  });
}

export function OidFieldPropsSchema(): z.ZodObject<Properties<OidFieldProps>> {
  return z.object({
    __typename: z.literal("OIDFieldProps").optional(),
    placeholder: z.string().nullish(),
    showIdField: z.boolean().nullish(),
  });
}

export function OidFieldPropsInputSchema(): z.ZodObject<
  Properties<OidFieldPropsInput>
> {
  return z.object({
    placeholder: z.string().nullish(),
    showIdField: z.boolean().nullish(),
  });
}

export function RemoveComponentInputSchema(): z.ZodObject<
  Properties<RemoveComponentInput>
> {
  return z.object({
    componentId: z.string(),
  });
}

export function RemoveFromGroupInputSchema(): z.ZodObject<
  Properties<RemoveFromGroupInput>
> {
  return z.object({
    componentIds: z.array(z.string()),
    id: z.string(),
  });
}

export function ReorderComponentsInputSchema(): z.ZodObject<
  Properties<ReorderComponentsInput>
> {
  return z.object({
    components: z.array(z.string()),
    insertBefore: z.string().nullish(),
  });
}

export function ResetSchemaInputSchema(): z.ZodObject<
  Properties<ResetSchemaInput>
> {
  return z.object({
    _empty: z.boolean().nullish(),
  });
}

export function SchemaEditorComponentSchema(): z.ZodObject<
  Properties<SchemaEditorComponent>
> {
  return z.object({
    id: z.string(),
  });
}

export function SetDocumentTypeInputSchema(): z.ZodObject<
  Properties<SetDocumentTypeInput>
> {
  return z.object({
    documentName: z.string().nullish(),
    documentType: z.string().nullish(),
  });
}

export function SetNewDocumentNameInputSchema(): z.ZodObject<
  Properties<SetNewDocumentNameInput>
> {
  return z.object({
    name: z.string(),
  });
}

export function SetSchemaInputSchema(): z.ZodObject<
  Properties<SetSchemaInput>
> {
  return z.object({
    schema: z.array(z.lazy(() => SchemaEditorComponentSchema())),
  });
}

export function SpacerComponentConfigSchema(): z.ZodObject<
  Properties<SpacerComponentConfig>
> {
  return z.object({
    __typename: z.literal("SpacerComponentConfig").optional(),
    height: z.number().nullish(),
    width: z.number().nullish(),
  });
}

export function StringFieldPropsSchema(): z.ZodObject<
  Properties<StringFieldProps>
> {
  return z.object({
    __typename: z.literal("StringFieldProps").optional(),
    description: z.string().nullish(),
    maxLength: z.number().nullish(),
    minLength: z.number().nullish(),
    multiline: z.boolean().nullish(),
    placeholder: z.string().nullish(),
  });
}

export function StringFieldPropsInputSchema(): z.ZodObject<
  Properties<StringFieldPropsInput>
> {
  return z.object({
    description: z.string().nullish(),
    maxLength: z.number().nullish(),
    minLength: z.number().nullish(),
    multiline: z.boolean().nullish(),
    placeholder: z.string().nullish(),
  });
}

export function ThemeSchema(): z.ZodObject<Properties<Theme>> {
  return z.object({
    __typename: z.literal("Theme").optional(),
    backgroundColor: z.string().nullish(),
    primaryColor: z.string().nullish(),
    secondaryTextColor: z.string().nullish(),
    textColor: z.string().nullish(),
  });
}
