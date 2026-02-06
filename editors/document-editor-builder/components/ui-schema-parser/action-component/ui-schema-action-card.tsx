import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import { useDocumentModelModuleById } from "@powerhousedao/reactor-browser";
import type { PHBaseState, PHDocument } from "document-model";
import { generateId } from "document-model/core";
import { BaselineIcon, CirclePlusIcon } from "lucide-react";
import { useMemo, type HTMLAttributes, type ReactNode } from "react";
import {
  type ActionComponentConfig,
  type EditorComponent,
  type InputComponentConfig,
} from "../../../../../document-models/document-editor-builder/index.js";
import { allChildComponents } from "../../../utils/component-utils.js";
import { useSchemaEditor } from "../../../context/SchemaEditorContext.js";
import useActionByActionId from "../../../hooks/useActionByActionId.js";
import { useDocumentModelInitialValues } from "../../../hooks/useDocumentModellnitialValues.js";
import { cn } from "../../../lib/utils.js";
import { parseActionSchema } from "../../../utils/parser-utils.js";
import ActionSettingsContent from "../../component-settings/ActionSettingsContent.js";
import AddActionPanel from "../../main-sidebar/AddActionPanel.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu.js";
import { Separator } from "../../ui/separator.js";
import UiSchemaWrapperCard from "../ui-schema-wrapper-card.js";
import { ActionCardFormControl } from "./action-card-form-control.js";
import type { ComponentRendererProps } from "../../../utils/component-renderer-utils.js";
import type { UseFormReturn } from "@powerhousedao/document-editor-builder/components";

interface DocumentState extends PHBaseState {
  global: {
    [key: string]: string | number | boolean;
  };
}
interface UiSchemaActionCardProps extends HTMLAttributes<HTMLDivElement> {
  editing: boolean;
  component: EditorComponent;
  previewDocument?: PHDocument;
  previewDispatch?: DocumentDispatch<any>;
  documentType?: string;
  groupId?: string;
  documentBuilderDispatch?: DocumentDispatch<any>;
  childComponents?: Array<EditorComponent>;
  schemaComponents?: Array<EditorComponent>;
  renderComponent: (props: ComponentRendererProps) => ReactNode;
}

export function UiSchemaActionCard({
  editing,
  component,
  previewDocument,
  previewDispatch,
  documentType,
  className,
  childComponents,
  groupId,
  schemaComponents,
  documentBuilderDispatch,
  renderComponent,
}: UiSchemaActionCardProps) {
  const { setEditComponent } = useSchemaEditor();
  const config = useMemo(
    () => component.config as ActionComponentConfig,
    [component.config]
  );
  const action = useActionByActionId(config?.action?.id, documentType);
  const initialValues = useDocumentModelInitialValues(
    documentType ?? undefined
  );

  const selectedDocumentModel = useDocumentModelModuleById(documentType);
  const fullSchema = useMemo(() => {
    return selectedDocumentModel?.specifications?.at(-1)?.state.global.schema;
  }, [selectedDocumentModel]);

  const parsedActionSchema = useMemo(() => {
    return action?.schema ? parseActionSchema(action.schema, fullSchema) : null;
  }, [action?.schema, fullSchema]);

  const fields = useMemo(() => {
    const inputs = allChildComponents(component, schemaComponents).filter(
      (c) =>
        c.type === "input" &&
        (c.config as InputComponentConfig)?.actionId ===
          (component.config as ActionComponentConfig)?.action?.id
    );
    return inputs;
  }, [component, schemaComponents]);

  const optionalFieldsMap = useMemo(() => {
    const map = new Map<string, boolean>();
    parsedActionSchema?.inputs.forEach((input) => {
      map.set(input.name, input.optional);
    });
    return map;
  }, [parsedActionSchema]);

  const enumOptionsMap = useMemo(() => {
    const map = new Map<string, string[]>();
    parsedActionSchema?.inputs.forEach((input) => {
      if (input.type === "Enum" && input.enumOptions) {
        map.set(input.name, input.enumOptions);
      }
    });
    return map;
  }, [parsedActionSchema]);

  // Build default values from initial fields and preview document
  // Note: React inputs require "" for strings and undefined for numbers, not null
  const defaultValues = useMemo(() => {
    const values: Record<string, string | number | boolean | null | undefined> =
      {};
    fields?.forEach((field) => {
      const config = field.config as InputComponentConfig;
      const configField = config.field;
      const initialValue = initialValues?.[
        configField.scope?.field as keyof typeof initialValues
      ] as string | number | boolean | null | undefined;

      if (configField.scope?.type === "binded") {
        const previewValue = (previewDocument?.state as DocumentState)?.global[
          configField.scope?.field ?? ""
        ];

        // Get the value from preview or initial values
        const fieldValue = previewValue ?? initialValue;

        // Set default value based on data type if value is null, undefined, or empty
        if (
          fieldValue === null ||
          fieldValue === undefined ||
          fieldValue === ""
        ) {
          if (configField.dataType === "Boolean") {
            values[configField.actionInput ?? ""] = false;
          } else {
            values[configField.actionInput ?? ""] = "";
          }
        } else {
          values[configField.actionInput ?? ""] = fieldValue;
        }
      } else if (configField.scope?.type === "default_value") {
        if (configField.dataType === "Boolean") {
          values[configField.actionInput ?? ""] = values[
            configField.actionInput ?? ""
          ] =
            configField.scope?.defaultValue === "true"
              ? true
              : configField.scope?.defaultValue === "false"
                ? false
                : (initialValue ?? false);
        } else {
          const defaultValue = configField.scope?.defaultValue;
          const value = defaultValue || initialValue;
          // Convert null/undefined to appropriate defaults for React inputs
          if (value === null || value === undefined) {
            values[configField.actionInput ?? ""] = "";
          } else {
            values[configField.actionInput ?? ""] = value;
          }
        }
      }
    });
    return values;
  }, [component.config, previewDocument?.state, initialValues]);

  const handleSubmit = async (formProps: UseFormReturn) => {
    // wait for the form to be updated
    await new Promise((resolve) => setTimeout(resolve, 10));

    const values = formProps.getValues() as Record<
      string,
      string | number | boolean | undefined
    >;
    const input = fields?.reduce(
      (acc, field) => {
        if (!(field.config as InputComponentConfig)?.field?.actionInput) {
          return acc;
        }
        const value =
          values[
            (field.config as InputComponentConfig)?.field?.actionInput ?? ""
          ];

        const dataType = (field.config as InputComponentConfig)?.field
          ?.dataType;

        // Convert form values to action input format
        // Empty strings and undefined become null for proper serialization
        let processedValue: string | number | boolean | null = null;

        if (dataType === "DateTime" || (dataType === "Date" && !!value)) {
          processedValue = new Date(value as string).toISOString();
        } else if (dataType === "Int" || dataType === "Float") {
          // For numbers, undefined/null/empty string should be null
          processedValue =
            value === undefined || value === null || value === ""
              ? null
              : Number(value);
        } else if (value !== undefined && value !== null) {
          // For other types, use the value or convert empty string to null
          if (typeof value === "string" && value === "") {
            processedValue = null;
          } else {
            processedValue = value;
          }
        }

        acc[(field.config as InputComponentConfig)?.field?.actionInput ?? ""] =
          processedValue;
        return acc;
      },
      {} as Record<string, string | number | boolean | null>
    );

    previewDispatch?.({
      id: generateId(),
      timestampUtcMs: new Date().toISOString(),
      type: action?.name || "",
      input: input,
      scope: action?.scope || "global",
    });
  };

  return (
    <UiSchemaWrapperCard
      editing={editing}
      component={component}
      className={className}
      groupId={groupId}
      WidgetIcon={BaselineIcon}
      title={config?.action?.name ?? "Form"}
      SettingsContent={ActionSettingsContent}
    >
      <>
        {!action ? (
          editing ? (
            <div className="flex flex-col h-full w-full items-center justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex flex-col items-center justify-center gap-4 p-6 h-full w-full">
                    <CirclePlusIcon className="w-6 h-6 rounded-full text-gray-400 stroke-1" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-0 min-w-[400px] max-h-[400px] max-w-[500px] overflow-y-auto">
                  <div className="flex flex-col gap-4 p-4">
                    <span className="flex flex-1 items-center gap-1 text-black">
                      <BaselineIcon className="text-black w-3 h-3" />
                      <span className="text-xs font-semibold">
                        {"Choose Form"}
                      </span>
                    </span>
                    <Separator />
                    <AddActionPanel
                      hideDescriptions
                      onChooseAction={(actionId) => {
                        setEditComponent(component.id, actionId);
                      }}
                    />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : null
        ) : (
          <div
            className={cn(
              "flex flex-col gap-4",
              editing ? "px-3 pb-3 pt-6" : ""
            )}
          >
            {component.control === "form" ? (
              <ActionCardFormControl
                component={component}
                childComponents={childComponents || []}
                editing={editing}
                handleSubmit={handleSubmit}
                defaultValues={defaultValues}
                optionalFieldsMap={optionalFieldsMap}
                enumOptionsMap={enumOptionsMap}
                documentBuilderDispatch={documentBuilderDispatch}
                previewDocument={previewDocument}
                previewDispatch={previewDispatch}
                schemaComponents={schemaComponents}
                documentType={documentType}
                renderComponent={renderComponent}
              />
            ) : (
              <div className="text-sm text-gray-500">
                No Template for {component.control}
              </div>
            )}
          </div>
        )}
      </>
    </UiSchemaWrapperCard>
  );
}

export default UiSchemaActionCard;
