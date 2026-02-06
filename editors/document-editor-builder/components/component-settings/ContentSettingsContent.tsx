import { Button, Select, TextInput } from "@powerhousedao/document-engineering";
import {
  actions,
  type ContentComponentConfig,
  type EditorComponent,
  type EditorComponentControl,
  type FieldDataType,
} from "../../../../document-models/document-editor-builder/index.js";
import { useSelectedDocumentEditorBuilderDocument } from "../../hooks/useDocumentEditorBuilderDocument.js";

import { confirm, Textarea } from "@powerhousedao/document-engineering/ui";
import {
  CircleMinusIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  List,
  PilcrowIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDocumentModelGlobalStateSchema } from "../../hooks/useDocumentModelGlobalStateSchema.js";
import { cn } from "../../lib/utils.js";
import {
  extractVariables,
  isValidVariable,
} from "../../utils/variable-interpolation.js";
import { Separator } from "../ui/separator.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs.js";
import { ComponentSettingsHeader } from "./ComponentSettingsHeader.js";
import { ContentFormatSection } from "../field-settings/ContentFormatSection.js";

export function ContentSettingsContent({
  component,
  onClose,
}: {
  component: EditorComponent;
  onClose: () => void;
}) {
  const [documentEditor, dispatch] = useSelectedDocumentEditorBuilderDocument();
  const documentStateSchema = useDocumentModelGlobalStateSchema(
    documentEditor.state.global.documentType ?? undefined
  );

  const [label, setLabel] = useState(
    (component?.config as ContentComponentConfig)?.label ?? ""
  );
  const [text, setText] = useState(
    (component?.config as ContentComponentConfig)?.text ?? ""
  );

  useEffect(() => {
    setLabel((component?.config as ContentComponentConfig)?.label ?? "");
    setText((component?.config as ContentComponentConfig)?.text ?? "");
  }, [component]);

  const handleLabelBlur = () => {
    if (
      !component ||
      label === (component.config as ContentComponentConfig)?.label
    )
      return;
    dispatch(
      actions.editContentComponent({
        id: component.id,
        label: label || "",
      })
    );
  };

  const handleTextBlur = () => {
    if (
      !component ||
      text === (component.config as ContentComponentConfig)?.text
    )
      return;
    dispatch(
      actions.editContentComponent({
        id: component.id,
        text: text || "",
      })
    );
  };

  const isState = useMemo(() => {
    return (component.config as ContentComponentConfig)?.scope !== null;
  }, [component.config]);

  const isList = useMemo(() => {
    return component.control === "bulletList";
  }, [component.control]);

  const isScopeDefined = useMemo(() => {
    return (
      isState && (component.config as ContentComponentConfig)?.scope !== ""
    );
  }, [isState, component.config]);

  const dataScopeOptions = useMemo(() => {
    return (documentStateSchema?.inputs ?? [])
      .filter((input) =>
        isState && !isScopeDefined
          ? true
          : !isList
            ? !input.isArray
            : input.isArray
      )
      .map((input) => input.name);
  }, [documentStateSchema, isList, isScopeDefined, isState]);

  const scopeDataType = useMemo(() => {
    return (component.config as ContentComponentConfig)?.scopeDataType;
  }, [component.config]);

  const shouldShowContentFormat = useMemo(() => {
    if (!scopeDataType) return false;
    return ["Date", "DateTime", "Int", "Float", "Boolean"].includes(
      scopeDataType
    );
  }, [scopeDataType]);

  // Extract variables from text and check if they're valid
  const variablesInText = useMemo(() => {
    if (!text || isState) return [];
    return extractVariables(text);
  }, [text, isState]);

  const availableStateFields = useMemo(() => {
    return (documentStateSchema?.inputs ?? []).map((input) => input.name);
  }, [documentStateSchema]);

  const variableStatus = useMemo(() => {
    const status: Record<string, { valid: boolean }> = {};
    variablesInText.forEach((variable) => {
      status[variable] = {
        valid: isValidVariable(variable, availableStateFields),
      };
    });
    return status;
  }, [variablesInText, availableStateFields]);

  const hasVariables = variablesInText.length > 0;
  const hasInvalidVariables = Object.values(variableStatus).some(
    (status) => !status.valid
  );

  return (
    <div className="flex flex-col w-full min-w-[315px] max-w-[400px]">
      <ComponentSettingsHeader
        componentId={component.id}
        title={
          (component.config as ContentComponentConfig)?.scope || "State Widget"
        }
        onClose={onClose}
      />

      <div className=" px-3 pb-4 flex-1 overflow-auto space-y-4">
        <div className="flex flex-col">
          <div className="flex flex-col gap-2 py-4">
            {(!isList || (isState && !isScopeDefined)) && (
              <>
                <div className="text-sm font-medium">Text Type</div>
                <div className="grid grid-cols-2 gap-2">
                  {["title", "subtitle", "label", "paragraph"].map((c, i) => (
                    <Button
                      key={c}
                      variant="outline"
                      size="lg"
                      className={cn(
                        "flex-1 justify-start",
                        component?.control === c
                          ? ""
                          : "border-gray-200 bg-transparent"
                      )}
                      onClick={() =>
                        dispatch(
                          actions.editContentComponent({
                            id: component.id,
                            control: c as EditorComponentControl,
                          })
                        )
                      }
                    >
                      {i === 0 ? (
                        <Heading1Icon className="w-4 h-4" />
                      ) : i === 1 ? (
                        <Heading2Icon className="w-4 h-4" />
                      ) : i === 2 ? (
                        <Heading3Icon className="w-4 h-4" />
                      ) : (
                        <PilcrowIcon className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium capitalize">
                        {c}
                      </span>
                    </Button>
                  ))}
                </div>
              </>
            )}
            {(isList || (isState && !isScopeDefined)) && (
              <>
                <div className="text-sm font-medium">List Type</div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    className={cn(
                      "flex-1 justify-start",
                      component?.control === "bulletList"
                        ? ""
                        : "border-gray-200 bg-transparent"
                    )}
                    onClick={() =>
                      dispatch(
                        actions.editContentComponent({
                          id: component.id,
                          control: "bulletList" as EditorComponentControl,
                        })
                      )
                    }
                  >
                    <List className="w-4 h-4" />
                    <span className="text-sm font-medium capitalize">
                      Bullet List
                    </span>
                  </Button>
                </div>
              </>
            )}
          </div>
          <Separator className="bg-gray-200" />

          <Tabs
            variant="underline"
            value={isState ? "state" : "content"}
            onValueChange={(value) => {
              if (value === "content") {
                dispatch(
                  actions.editContentComponent({
                    id: component.id,
                    scope: null,
                    scopeDataType: null,
                    label: null,
                  })
                );
              } else {
                dispatch(
                  actions.editContentComponent({
                    id: component.id,
                    scope:
                      (component.config as ContentComponentConfig)?.scope ?? "",
                    scopeDataType: isList
                      ? null
                      : ((component.config as ContentComponentConfig)
                          ?.scopeDataType ?? null),
                    label:
                      (component.config as ContentComponentConfig)?.label ?? "",
                  })
                );
              }
            }}
          >
            <TabsList className="w-full">
              <TabsTrigger value="state">State</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>
            <TabsContent value="state">
              <div className="flex flex-col gap-4">
                <Select
                  label="Scope"
                  name="scope"
                  options={dataScopeOptions.map((layout) => ({
                    label: layout,
                    value: layout,
                  }))}
                  value={
                    (component.config as ContentComponentConfig)?.scope ?? ""
                  }
                  clearable
                  placeholder="Select a State Field"
                  onChange={(value) => {
                    const inputField = documentStateSchema?.inputs?.find(
                      (i) => i.name === value
                    );

                    // Valid FieldDataType values
                    const validFieldDataTypes: FieldDataType[] = [
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
                    ];

                    // Determine scopeDataType:
                    // - null if it's a list (array)
                    // - null if the type is not a valid FieldDataType (e.g., custom types)
                    // - the dataType otherwise
                    const dataType = inputField?.type as FieldDataType | null;
                    const isValidDataType =
                      dataType && validFieldDataTypes.includes(dataType);

                    const finalScopeDataType =
                      isList || inputField?.isArray || !isValidDataType
                        ? null
                        : dataType;

                    dispatch(
                      actions.editContentComponent({
                        id: component.id,
                        control: inputField?.isArray
                          ? "bulletList"
                          : isList
                            ? "label"
                            : undefined,
                        scope: value as string,
                        scopeDataType: finalScopeDataType,
                      })
                    );
                  }}
                />
                <TextInput
                  label="Text Label"
                  name="text-label"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  onBlur={handleLabelBlur}
                  placeholder="Text Label"
                />
                {shouldShowContentFormat && scopeDataType && (
                  <ContentFormatSection
                    componentId={component.id}
                    component={component.config as ContentComponentConfig}
                    dataType={scopeDataType}
                  />
                )}
              </div>
            </TabsContent>
            <TabsContent value="content">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Textarea
                    label="Content Text"
                    name="content-text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onBlur={handleTextBlur}
                    placeholder="Write your content here"
                    description={
                      isList
                        ? "Enter a list of items separated by a semicolon (;)"
                        : "Use ${variableName} syntax to interpolate document state fields."
                    }
                  />
                  {hasVariables && (
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="text-xs font-medium text-gray-600">
                        Variables detected:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {variablesInText.map((variable) => {
                          const isValid =
                            variableStatus[variable]?.valid ?? false;
                          return (
                            <span
                              key={variable}
                              className={cn(
                                "text-xs px-2 py-1 rounded",
                                isValid
                                  ? "bg-green-100 text-green-800 border border-green-300"
                                  : "bg-red-100 text-red-800 border border-red-300"
                              )}
                            >
                              ${variable}
                              {isValid ? " ✓" : " ✗"}
                            </span>
                          );
                        })}
                      </div>
                      {hasInvalidVariables && (
                        <div className="text-xs text-red-600 mt-1">
                          Invalid variables will not be replaced.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <Separator className="bg-gray-200" />
        <div className="flex items-center justify-end gap-4">
          <Button
            variant="outline"
            className="text-red-800 border-red-800 hover:text-red-900"
            onClick={async () => {
              const ok = await confirm({
                title: "Remove component?",
                description: "This will delete the component from the preview.",
                confirmLabel: "Remove",
                cancelLabel: "Cancel",
              });
              if (ok) {
                dispatch(
                  actions.removeComponent({ componentId: component.id })
                );
              }
            }}
          >
            <span className="text-sm font-medium">Remove</span>
            <CircleMinusIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ContentSettingsContent;
