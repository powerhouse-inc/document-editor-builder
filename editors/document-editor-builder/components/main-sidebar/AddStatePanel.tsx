import { Button } from "@powerhousedao/document-engineering";
import { useDocumentModelModuleById } from "@powerhousedao/reactor-browser";
import { generateId } from "document-model";
import { CheckCheck, PlusCircleIcon } from "lucide-react";
import { useMemo } from "react";
import {
  actions,
  type EditorComponent,
} from "../../../../document-models/document-editor-builder/index.js";
import { useSelectedDocumentEditorBuilderDocument } from "../../hooks/useDocumentEditorBuilderDocument.js";
import { cn } from "../../lib/utils.js";
import {
  parseStateSchema,
  type ParsedInputField,
} from "../../utils/parser-utils.js";
import { checkIfStateFieldInUISchema } from "../../utils/ui-schema-utils.js";
import { SchemaInput } from "../schema/SchemaInput.js";

export default function AddStatePanel() {
  const [documentEditor] = useSelectedDocumentEditorBuilderDocument();

  const documentTypeId = useMemo(() => {
    return documentEditor?.state.global.documentType;
  }, [documentEditor]);

  const selectedDocumentModel = useDocumentModelModuleById(documentTypeId);

  const stateSchema = useMemo(() => {
    return selectedDocumentModel?.specifications?.at(-1)?.state.global.schema;
  }, [selectedDocumentModel]);

  const uischema = useMemo(() => {
    return documentEditor?.state.global.schema || [];
  }, [documentEditor]);

  if (!stateSchema) {
    return <div className="text-xs text-gray-500">No state schema</div>;
  }

  const parsed = parseStateSchema(stateSchema);

  if (!parsed) {
    return (
      <div className="text-xs text-gray-500">Could not parse state schema</div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {parsed.inputs.map((input) => (
        <ParsedInput key={input.name} input={input} schema={uischema} />
      ))}
    </div>
  );
}

const ParsedInput = ({
  schema,
  input,
}: {
  schema: EditorComponent[];
  input: ParsedInputField;
}) => {
  const [_, dispatch] = useSelectedDocumentEditorBuilderDocument();
  const addedToSchema = checkIfStateFieldInUISchema(schema, input.name);
  return (
    <div className="flex justify-between items-center gap-2">
      <div className="flex-1 truncate">
        <SchemaInput input={input} light={!addedToSchema.isAdded} />
      </div>

      <div className="flex items-center gap-0.5">
        <div
          className={cn(
            "flex items-center gap-1 text-xs bg-[#EAEAEA] text-[#6B7280] rounded-full px-1 py-0",
            addedToSchema.isAdded ? "opacity-100" : "opacity-0"
          )}
        >
          {addedToSchema.count || 1} <CheckCheck size={16} />
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="text-gray-500 w-6 h-6"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(
              actions.addComponent({
                id: generateId(),
                type: "content",
                control: input.isArray ? "bulletList" : "label",
                scope: input.name,
                scopeDataType: input.isArray ? null : input.type,
              })
            );
          }}
        >
          <PlusCircleIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
