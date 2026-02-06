import { useDocumentModelModuleById } from "@powerhousedao/reactor-browser";
import { CheckCheck, ChevronDown, PlusCircleIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useSelectedDocumentEditorBuilderDocument } from "../../hooks/useDocumentEditorBuilderDocument.js";
import { useSchemaEditor } from "../../context/SchemaEditorContext.js";
import { parseActionSchema } from "../../utils/parser-utils.js";
import { checkIfActionInUISchema } from "../../utils/ui-schema-utils.js";
import { ButtonDiv } from "../ui/button-div.js";
import { SchemaInput } from "../schema/SchemaInput.js";

interface AddActionPanelProps {
  onChooseAction?: (actionId: string) => void;
  hideDescriptions?: boolean;
}

export default function AddActionPanel({
  onChooseAction,
  hideDescriptions,
}: AddActionPanelProps) {
  const [documentEditor] = useSelectedDocumentEditorBuilderDocument();

  const { setEditComponent } = useSchemaEditor();

  const documentTypeId = useMemo(() => {
    return documentEditor?.state.global.documentType;
  }, [documentEditor]);

  const selectedDocumentModel = useDocumentModelModuleById(documentTypeId);

  const modules = useMemo(() => {
    return selectedDocumentModel?.specifications?.at(-1)?.modules || [];
  }, [selectedDocumentModel]);

  const fullSchema = useMemo(() => {
    return selectedDocumentModel?.specifications?.at(-1)?.state.global.schema;
  }, [selectedDocumentModel]);

  const openDialogForAction = useCallback(
    (actionId: string) => {
      if (onChooseAction) {
        onChooseAction(actionId);
      } else {
        setEditComponent(actionId);
      }
    },
    [setEditComponent]
  );

  const uischema = useMemo(() => {
    return documentEditor?.state.global.schema || [];
  }, [documentEditor]);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const onToggle = (key: string) =>
    setExpanded((prev) => {
      const isOpen = !prev[key];
      return { ...prev, [key]: isOpen };
    });

  return (
    <div className="flex flex-col text-left gap-6">
      {modules.map((mod, mIdx) => (
        <div key={`m-${mIdx}`} className="flex flex-col gap-3">
          <div className="text-xs font-medium text-primary-blue uppercase">
            {mod?.name || `Module ${mIdx + 1}`}
          </div>
          {(mod.operations || []).length === 0 ? (
            <div className="text-xs text-gray-400 mb-2">No actions</div>
          ) : (
            <ul className="flex flex-col border border-gray-200 rounded-md p-4 gap-6">
              {mod.operations.map((op, oIdx) => {
                const key = `${mIdx}-${op.name}-${oIdx}`;
                const isOpen = !!expanded[key];
                const parsed = op.schema
                  ? parseActionSchema(op.schema, fullSchema)
                  : null;
                const addedToSchema = checkIfActionInUISchema(uischema, op.id);

                return (
                  <li key={key} className="">
                    <button
                      className="w-full flex items-start justify-between text-left"
                      onClick={() => onToggle(key)}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm text-black">{op.name}</span>
                        {op.description && isOpen && !hideDescriptions && (
                          <span className="text-xs font-light text-gray-500">
                            {op.description}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5">
                        {addedToSchema.isAdded && (
                          <div className="flex items-center gap-1 text-xs bg-[#EAEAEA] text-[#6B7280] rounded-full px-1 py-0">
                            {addedToSchema.count} <CheckCheck size={16} />
                          </div>
                        )}
                        <ButtonDiv
                          size="icon"
                          variant="ghost"
                          className="text-gray-500 w-6 h-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            openDialogForAction(op.id);
                          }}
                        >
                          <PlusCircleIcon className="w-4 h-4" />
                        </ButtonDiv>
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
                                  <SchemaInput key={input.name} input={input} />
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
  );
}
