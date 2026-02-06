import {
  Button,
  NumberInput,
  Select,
  TextInput,
} from "@powerhousedao/document-engineering";
import { confirm } from "@powerhousedao/document-engineering/ui";
import {
  actions,
  type EditorComponent,
  type FieldScope,
  type InputComponentConfig,
  type ScopeType,
} from "../../../../document-models/document-editor-builder/index.js";
import { useSelectedDocumentEditorBuilderDocument } from "../../hooks/useDocumentEditorBuilderDocument.js";
import { useDocumentModelGlobalStateSchema } from "../../hooks/useDocumentModelGlobalStateSchema.js";
import { Separator } from "../ui/separator.js";

import { CircleMinusIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FieldPropsSection } from "./FieldPropsSection.js";
import { ComponentSettingsHeader } from "../component-settings/ComponentSettingsHeader.js";
import useActionByActionId from "../../hooks/useActionByActionId.js";
import { parseActionSchema } from "../../utils/parser-utils.js";
import { useDocumentModelModuleById } from "@powerhousedao/reactor-browser";

interface FieldSettingsProps {
  component: EditorComponent;
  onClose: () => void;
}
export function FieldSettings({ component, onClose }: FieldSettingsProps) {
  const [documentEditor, dispatch] = useSelectedDocumentEditorBuilderDocument();

  const documentType = useMemo(() => {
    return documentEditor.state.global.documentType ?? undefined;
  }, [documentEditor.state.global.documentType]);

  const otherComponentFields = useMemo(() => {
    return documentEditor.state.global.schema.filter(
      (c) =>
        c.id !== component.id &&
        c.groupId === component?.groupId &&
        c.type === "input"
    );
  }, [documentEditor.state.global.schema, component, component.id]);

  const action = useActionByActionId(
    (component.config as InputComponentConfig)?.actionId,
    documentType
  );
  const selectedDocumentModel = useDocumentModelModuleById(documentType);
  const fullSchema = useMemo(() => {
    return selectedDocumentModel?.specifications?.at(-1)?.state.global.schema;
  }, [selectedDocumentModel]);

  const parsedActionSchema = useMemo(() => {
    return action?.schema ? parseActionSchema(action.schema, fullSchema) : null;
  }, [action?.schema, fullSchema]);

  const isOptional = useMemo(() => {
    const field = parsedActionSchema?.inputs.find((input) => {
      return (
        input.name === (component.config as InputComponentConfig)?.field?.name
      );
    });

    return field?.optional ?? false;
  }, [parsedActionSchema]);

  const field = useMemo(() => {
    return (component?.config as InputComponentConfig)?.field;
  }, [component]);

  const isButtonField = useMemo(() => {
    return (
      field?.scope?.type === "submit_button" ||
      field?.scope?.type === "reset_button"
    );
  }, [field?.scope?.type]);

  const documentStateSchema = useDocumentModelGlobalStateSchema(
    documentEditor.state.global.documentType ?? undefined
  );

  const [name, setName] = useState(field?.name ?? "");
  const [scope, setScope] = useState<FieldScope>(
    field?.scope ?? {
      type: "not_binded",
      field: "",
      defaultValue: null,
    }
  );

  useEffect(() => {
    setName(field?.name ?? "");
    setScope(
      field?.scope ?? {
        type: "not_binded",
        field: "",
        defaultValue: null,
      }
    );
  }, [field?.name, field?.scope]);

  const dataScopeOptions = useMemo(() => {
    return documentStateSchema?.inputs ?? [];
  }, [documentStateSchema]);

  const filteredDataScopeOptions = useMemo(() => {
    if (!field) return [];

    const usedScopes = new Set(
      ...(otherComponentFields.map((f) =>
        (f.config as InputComponentConfig)?.field?.scope?.type === "binded"
          ? [(f.config as InputComponentConfig)?.field?.scope?.field]
          : []
      ) ?? [])
    );

    // Filter by data type and exclude already used scopes
    return dataScopeOptions.filter(
      (d) => d.type === field?.dataType && !usedScopes.has(d.name)
    );
  }, [dataScopeOptions, field, documentEditor.state.global.schema]);

  const handleNameBlur = () => {
    if (!field || name === field?.name) return;
    dispatch(
      actions.editFieldActionComponent({
        fieldId: component.id,
        name: name ?? "",
      })
    );
  };

  const handleScopeChange = (
    type: ScopeType,
    fieldValue: string | null,
    defaultValue: string | null
  ) => {
    if (!field) return;
    const newScope = {
      type,
      field: fieldValue,
      defaultValue,
    };

    setScope(newScope);
    dispatch(
      actions.editFieldActionComponent({
        fieldId: component.id,
        scopeType: type,
        scopeField: fieldValue,
        scopeDefaultValue: defaultValue,
      })
    );
  };
  const [constantValue, setConstantValue] = useState<string | null>(
    field?.scope?.defaultValue ?? null
  );

  useEffect(() => {
    setConstantValue(field?.scope?.defaultValue ?? null);
  }, [field?.scope?.defaultValue]);

  if (!field) {
    return null;
  }

  return (
    <div className="flex flex-col w-full min-w-[315px] gap-4">
      <ComponentSettingsHeader
        componentId={component.id}
        title={
          isButtonField
            ? field.name || "Button"
            : field.actionInput || field.name || "Field"
        }
        onClose={onClose}
      />

      <div className="flex-1 overflow-auto px-3 pb-4 space-y-4">
        {!isButtonField && (
          <>
            <div>
              <TextInput
                label="Name"
                name="field-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleNameBlur}
                placeholder="Field name"
              />
            </div>
            <div className="flex flex-col gap-4">
              <Select
                label="Value"
                name="scope-type"
                options={[
                  {
                    label: "Not Bound",
                    value: "not_binded",
                  },
                  {
                    label: "Bound",
                    value: "binded",
                  },
                  {
                    label: "Default Value",
                    value: "default_value",
                  },
                ]}
                value={scope?.type ?? "not_binded"}
                placeholder="How is the value bound?"
                multiple={false}
                clearable
                onChange={(value) =>
                  handleScopeChange(
                    value as ScopeType,
                    scope.field ?? null,
                    scope.defaultValue ?? null
                  )
                }
              />
              {field?.scope?.type === "binded" && (
                <Select
                  label="Bound Field"
                  name="scope-field"
                  options={filteredDataScopeOptions.map((o) => ({
                    label: o.name,
                    value: o.name,
                  }))}
                  value={field?.scope?.field ?? ""}
                  placeholder="Select data scope"
                  multiple={false}
                  clearable
                  onChange={(value) =>
                    handleScopeChange(
                      scope.type,
                      value as string | null,
                      scope.defaultValue ?? null
                    )
                  }
                />
              )}
              {field?.scope?.type === "default_value" &&
                (field?.dataType === "Int" ||
                field?.dataType === "Float" ||
                field?.dataType === "Amount" ? (
                  <NumberInput
                    label="Default Value"
                    name="scope-default-value"
                    value={constantValue ? Number(constantValue) : undefined}
                    placeholder="Enter default value"
                    onChange={(e) => setConstantValue(e.target.value)}
                    onBlur={(e) =>
                      handleScopeChange(
                        scope.type,
                        scope.field ?? null,
                        e.target.value ? String(e.target.value) : null
                      )
                    }
                  />
                ) : field?.dataType === "Boolean" ? (
                  <Select
                    label="Default Value"
                    name="scope-default-value"
                    options={[
                      { label: "True", value: "true" },
                      { label: "False", value: "false" },
                    ]}
                    value={field?.scope?.defaultValue ?? "false"}
                    placeholder="Enter default value"
                    onChange={(value) =>
                      handleScopeChange(
                        scope.type,
                        scope.field ?? null,
                        value as string | null
                      )
                    }
                  />
                ) : (
                  <TextInput
                    label="Define default value"
                    name="scope-default-value"
                    value={constantValue ?? ""}
                    placeholder="Enter default value"
                    onChange={(e) => setConstantValue(e.target.value)}
                    onBlur={(e) =>
                      handleScopeChange(
                        scope.type,
                        scope.field ?? null,
                        e.target.value
                      )
                    }
                  />
                ))}
            </div>
          </>
        )}
        <FieldPropsSection
          fieldId={component.id}
          field={field}
          hideDivider={isButtonField}
        />
        {isOptional && !isButtonField && (
          <>
            <Separator className="bg-gray-200" />
            <div className="flex items-center justify-end gap-4">
              <Button
                variant="outline"
                className="text-red-800 border-red-800 hover:text-red-900"
                onClick={async () => {
                  const ok = await confirm({
                    title: "Remove field?",
                    description:
                      "This will delete the field from the component.",
                    confirmLabel: "Remove",
                    cancelLabel: "Cancel",
                  });
                  if (ok) {
                    dispatch?.(
                      actions.removeComponent({
                        componentId: component.id,
                      })
                    );
                  }
                }}
              >
                <span className="text-sm font-medium">Remove</span>
                <CircleMinusIcon className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FieldSettings;
