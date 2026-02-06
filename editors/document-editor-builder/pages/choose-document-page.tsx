import { Button, Select, TextInput } from "@powerhousedao/document-engineering";
import {
  useAllowedDocumentModelModules,
  useAllowedDocumentTypes,
  useDocumentModelModuleById,
  useDocumentOfType,
} from "@powerhousedao/reactor-browser";
import {
  type DocumentModelAction,
  type DocumentModelDocument,
} from "document-model";
import {
  ArrowRightIcon,
  BookIcon,
  ChevronDown,
  CircleMinusIcon,
} from "lucide-react";
import {
  Suspense,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import { SchemaInput } from "../components/schema/index.js";
import { Separator } from "../components/ui/separator.js";
import useAllDocumentModels from "../hooks/useAllDocumentModels.js";
import { useSelectedDocumentEditorBuilderDocument } from "../hooks/useDocumentEditorBuilderDocument.js";
import { parseActionSchema } from "../utils/parser-utils.js";

interface IProps {
  onConfirm: (documentType: string, documentName: string) => void;
}

export default function ChooseDocumentPage({ onConfirm }: IProps) {
  const [documentEditor] = useSelectedDocumentEditorBuilderDocument();

  const [documentType, setDocumentType] = useState<string | null>(
    documentEditor.state.global.documentType ?? null
  );
  const [documentName, setDocumentName] = useState<string | null>(
    documentEditor.state.global.documentName ?? null
  );

  const documentModels = useAllDocumentModels();
  const allowedDocumentModelModules = useAllowedDocumentModelModules();

  const filteredDocumentModels = useMemo(() => {
    return allowedDocumentModelModules?.filter(
      (m) =>
        documentModels?.some((am) => am.name === m.name) &&
        m.id !== "powerhouse/document-editor-builder"
    );
  }, [documentModels, allowedDocumentModelModules]);

  const selectedDocumentModel = useMemo(() => {
    return allowedDocumentModelModules?.find((m) => m.id === documentType);
  }, [filteredDocumentModels, documentType]);

  const modules = useMemo(() => {
    return selectedDocumentModel?.specifications?.at(-1)?.modules || [];
  }, [selectedDocumentModel]);

  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDocumentName(e.target.value);
  };

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const onToggle = (key: string) =>
    setExpanded((prev) => {
      const isOpen = !prev[key];
      return { ...prev, [key]: isOpen };
    });

  return (
    <Suspense>
      <div className="h-full flex flex-col gap-y-12 py-4 px-6 xl:py-8 xl:px-12">
        {/* Header Section */}
        <div className="flex justify-between">
          <div className="flex flex-col gap-y-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Create New Editor
            </h1>
            <span className="text-sm font-light text-gray-400 max-w-1/2">
              The builder will work with the operations available in a document
              model, allowing you to create and preview an editor for your
              document.
            </span>
          </div>
          <div className="flex pt-4">
            <Button
              onClick={() =>
                onConfirm(selectedDocumentModel?.id || "", documentName ?? "")
              }
              disabled={
                !selectedDocumentModel ||
                !selectedDocumentModel?.id ||
                !documentName
              }
            >
              Continue
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-x-16 flex-1 overflow-auto">
          <div className="flex flex-col gap-y-4 flex-1">
            <span className="text-sm font-medium text-gray-900">
              1. Choose a Document Model
            </span>
            {!selectedDocumentModel ? (
              <Select
                name="select"
                className="max-w-[400px]"
                options={filteredDocumentModels?.map((d) => ({
                  label: d.name,
                  value: d.id,
                }))}
                value={documentType || ""}
                placeholder="Select Document Model"
                multiple={false}
                onChange={(value) => {
                  const doc = filteredDocumentModels?.find(
                    (d) => d.id === value
                  );
                  setDocumentType(value as string);
                  setDocumentName((doc?.name as string).trim() + " - Editor");
                }}
              />
            ) : (
              <div className="flex flex-col text-left border border-gray-200 bg-[#FCFAFA] rounded-md px-4 pt-4 overflow-auto">
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <BookIcon className="w-4 h-4 " />
                      <span className="text-sm font-medium text-gray-900">
                        {selectedDocumentModel.name}
                      </span>
                    </div>
                    <span className="text-xs font-light text-gray-400">
                      {selectedDocumentModel.id}
                    </span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-gray-500 w-6 h-6 hover:text-gray-700"
                    onClick={() => {
                      setDocumentType(null);
                      setDocumentName("");
                    }}
                  >
                    <CircleMinusIcon className="w-4 h-4" />
                  </Button>
                </div>
                <Separator className="mt-4" />
                <div className="flex flex-col gap-4 overflow-auto py-4">
                  <span className="text-sm font-medium text-[#5C5C5C]">
                    Available Actions
                  </span>
                  <div className="bg-white flex flex-col gap-4 p-4">
                    {modules.map((mod, mIdx) => (
                      <div key={`m-${mIdx}`} className="flex flex-col gap-3">
                        <div className="text-xs font-medium text-primary-blue uppercase">
                          {mod?.name || `Module ${mIdx + 1}`}
                        </div>
                        {(mod.operations || []).length === 0 ? (
                          <div className="text-xs text-gray-400 mb-2">
                            No actions
                          </div>
                        ) : (
                          <ul className="flex flex-col border border-gray-200 rounded-md p-4 gap-6">
                            {mod.operations.map((op, oIdx) => {
                              const key = `${mIdx}-${op.name}-${oIdx}`;
                              const isOpen = !!expanded[key];
                              const parsed = op.schema
                                ? parseActionSchema(op.schema)
                                : null;

                              return (
                                <li key={key} className="">
                                  <button
                                    className="w-full flex items-center justify-between text-left"
                                    onClick={() => onToggle(key)}
                                  >
                                    <div className="flex flex-col">
                                      <span className="text-sm text-black">
                                        {op.name}
                                      </span>
                                      <span className="text-xs font-light text-gray-500">
                                        {op.description}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-0.5">
                                      <ChevronDown
                                        className={`w-4 h-4 text-gray-500 transition-transform ${!isOpen ? "rotate-180" : ""}`}
                                      />
                                    </div>
                                  </button>
                                  {isOpen && (
                                    <div>
                                      {parsed ? (
                                        <div className="pt-2">
                                          {parsed.inputs.length > 0 ? (
                                            <div className="flex flex-col gap-2">
                                              {parsed.inputs.map((input) => (
                                                <SchemaInput
                                                  key={input.name}
                                                  input={input}
                                                />
                                              ))}
                                            </div>
                                          ) : (
                                            <div className="text-xs text-gray-500">
                                              No inputs
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <div className="text-xs text-gray-500">
                                          No schema available
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          {selectedDocumentModel && (
            <>
              <div className="h-full w-px bg-gray-300" />
              <div className="flex flex-col gap-y-4 flex-1">
                <TextInput
                  label="2. Define a Document Title"
                  placeholder="Write a Name"
                  value={documentName || ""}
                  onChange={onNameChange}
                  description={selectedDocumentModel.id}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </Suspense>
  );
}
