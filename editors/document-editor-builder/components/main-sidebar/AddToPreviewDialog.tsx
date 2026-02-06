import { Button, Checkbox, Select } from "@powerhousedao/document-engineering";
import { useDocumentModelModuleById } from "@powerhousedao/reactor-browser";
import { generateId } from "document-model/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  EditorComponentControl,
  FieldDataType,
  ActionComponentConfig,
  InputComponentConfig,
} from "../../../../document-models/document-editor-builder/index.js";
import { actions } from "../../../../document-models/document-editor-builder/index.js";
import { useSelectedDocumentEditorBuilderDocument } from "../../hooks/useDocumentEditorBuilderDocument.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog.js";
import { useSchemaEditor } from "../../context/SchemaEditorContext.js";
import useActionByActionId from "../../hooks/useActionByActionId.js";
import { useDocumentModelGlobalStateSchema } from "../../hooks/useDocumentModelGlobalStateSchema.js";
import {
  parseActionSchema,
  type ParsedInputField,
} from "../../utils/parser-utils.js";
import { SchemaInput } from "../schema/SchemaInput.js";
import { allChildComponents } from "../../utils/component-utils.js";

type InputSelection = {
  id?: string;
  included: boolean;
  type: FieldDataType;
  scope?: string;
};

export default function AddToPreviewDialog() {
  const { editComponentId, editComponentActionId, clearEdit } =
    useSchemaEditor();

  return (
    <AddToPreviewDialogContent
      key={editComponentId}
      editComponentId={editComponentId}
      editComponentActionId={editComponentActionId}
      clearEdit={clearEdit}
    />
  );
}

const AddToPreviewDialogContent = ({
  editComponentId,
  editComponentActionId,
  clearEdit,
}: {
  editComponentId: string | null;
  editComponentActionId: string | null;
  clearEdit: () => void;
}) => {
  const [documentEditor, dispatch] = useSelectedDocumentEditorBuilderDocument();

  const open = !!editComponentId;

  const component = useMemo(() => {
    return documentEditor.state.global.schema.find(
      (c) => c.id === editComponentId
    );
  }, [documentEditor.state.global.schema, editComponentId]);

  const isEditMode = !!component;

  const actionId = useMemo(() => {
    return (
      (component?.config as ActionComponentConfig)?.action?.id ||
      editComponentActionId ||
      editComponentId ||
      ""
    );
  }, [component, editComponentId, editComponentActionId]);

  const documentStateSchema = useDocumentModelGlobalStateSchema(
    documentEditor.state.global.documentType ?? undefined
  );

  const action = useActionByActionId(
    actionId,
    documentEditor.state.global.documentType ?? undefined
  );

  const actionName =
    (component?.config as ActionComponentConfig)?.action?.name ||
    action?.name ||
    "";
  const actionFields = useMemo(
    () =>
      component
        ? allChildComponents(
            component,
            documentEditor.state.global.schema
          ).filter(
            (c) =>
              c.type === "input" &&
              (c.config as InputComponentConfig).actionId === actionId
          ) || []
        : [],
    [component, documentEditor.state.global.schema]
  );

  const selectedDocumentModel = useDocumentModelModuleById(
    documentEditor.state.global.documentType ?? undefined
  );
  const fullSchema = useMemo(() => {
    return selectedDocumentModel?.specifications?.at(-1)?.state.global.schema;
  }, [selectedDocumentModel]);

  const parsed = useMemo(
    () =>
      action?.schema ? parseActionSchema(action.schema, fullSchema) : null,
    [action, fullSchema]
  );

  const [selections, setSelections] = useState<Record<string, InputSelection>>(
    {}
  );

  const dataScopeOptions = useMemo(() => {
    return documentStateSchema?.inputs ?? [];
  }, [documentStateSchema]);

  useEffect(() => {
    if (!parsed) return;
    const next: Record<string, InputSelection> = {};
    for (const input of parsed.inputs) {
      const required = !input.optional;
      const existingField = actionFields?.find(
        (field) =>
          (field.config as InputComponentConfig)?.field?.actionInput ===
          input.name
      );

      next[input.name] = {
        included: required || !!existingField,
        type: input.type,
        id: existingField?.id,
        scope:
          (existingField?.config as InputComponentConfig)?.field?.scope
            ?.type === "binded"
            ? ((existingField?.config as InputComponentConfig)?.field?.scope
                ?.field ?? undefined)
            : ((existingField?.config as InputComponentConfig)?.field?.scope
                ?.type ??
              dataScopeOptions.find((d) => d.name === input.name)?.name),
      };
    }
    setSelections(next);
  }, [parsed, actionFields, dataScopeOptions]);

  const handleToggle = (input: ParsedInputField, checked: boolean) => {
    setSelections((prev) => {
      const required = !input.optional;
      const nextIncluded = required ? true : checked;
      const current = prev[input.name] || { included: false };
      return {
        ...prev,
        [input.name]: {
          included: nextIncluded,
          type: input.type,
          scope:
            current?.scope ??
            dataScopeOptions.find((d) => d.name === input.name)?.name,
          id: current?.id,
        },
      };
    });
  };
  const handleDataScopeChange = (name: string, value: string | null) => {
    setSelections((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        scope: value ?? prev[name]?.scope,
      },
    }));
  };

  const handleSubmit = useCallback(() => {
    const selectedInputs: Array<{
      id?: string;
      name: string;
      type: FieldDataType;
      scope: string;
    }> = [];

    Object.entries(selections).forEach(([name, sel]) => {
      if (sel.included) {
        selectedInputs.push({
          name,
          type: sel.type,
          id: sel.id,
          scope: sel.scope!,
        });
      }
    });

    if (isEditMode) {
      const fields = selectedInputs.map((input) => ({
        id: input.id || generateId(),
        actionInput: input.name,
        dataType: input.type,
        scope: input.scope,
      }));

      dispatch(
        actions.editActionComponent({
          id: editComponentId || "",
          actionId: editComponentActionId || "",
          actionName: actionName,
          fields,
        })
      );
    } else {
      dispatch(
        actions.addActionComponent({
          id: generateId(),
          control: "form" as EditorComponentControl,
          actionId: actionId,
          actionName: actionName,
          initialFields: selectedInputs.map((input) => ({
            id: generateId(),
            actionInput: input.name,
            dataType: input.type,
            scope: input.scope,
          })),
          insertBefore: null,
        })
      );
    }

    clearEdit();
  }, [
    selections,
    isEditMode,
    editComponentId,
    editComponentActionId,
    actionId,
    actionName,
    dispatch,
    clearEdit,
  ]);

  const isValid = useMemo(() => {
    return !!action;
  }, [selections]);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && clearEdit()}>
      <DialogContent className="min-w-full sm:min-w-[500px] max-h-[90%] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {!action
              ? "Edit Action Component"
              : isEditMode
                ? `Edit ${actionName} in preview`
                : `Add ${actionName} to preview`}
          </DialogTitle>
          <DialogDescription>
            {!action
              ? "Please select an action"
              : "Choose which inputs to include and which component to use for each."}
          </DialogDescription>
        </DialogHeader>

        <>
          {!parsed || parsed.inputs.length === 0 ? (
            <div className="text-sm text-gray-600">
              This action has no inputs.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {parsed.inputs.map((input) => {
                const required = !input.optional;
                const sel = selections[input.name] || { included: required };

                const filteredDataScopeOptions = dataScopeOptions.filter(
                  (d) =>
                    d.type === input.type &&
                    !Object.keys(selections).some(
                      (s) => s !== input.name && selections[s].scope === d.name
                    )
                );

                return (
                  <div
                    key={input.name}
                    className="flex items-center justify-between gap-4 border border-gray-200 rounded-md p-3"
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox
                        value={sel.included}
                        onChange={(v: boolean) => handleToggle(input, v)}
                        disabled={required}
                      />
                      <SchemaInput input={input} />
                    </div>
                    <div className="max-w-40 min-w-40 ">
                      <Select
                        label="Data Scope"
                        clearable
                        name={`${input.name}-data-scope`}
                        options={[
                          { label: "Not bound", value: "not_binded" },
                          {
                            label: "Default Value",
                            value: "default_value",
                          },
                          ...filteredDataScopeOptions.map((o) => ({
                            label: o.name,
                            value: o.name,
                          })),
                        ]}
                        value={
                          sel.included
                            ? sel.scope || "not_binded"
                            : "not_binded"
                        }
                        placeholder="Select data scope"
                        multiple={false}
                        onChange={(v) =>
                          handleDataScopeChange(input.name, v as string | null)
                        }
                        disabled={!sel.included}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>

        <DialogFooter>
          <Button variant="ghost" onClick={clearEdit}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            {isEditMode ? "Save changes" : "Add to preview"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
