import { useDocumentModelModuleById } from "@powerhousedao/reactor-browser";
import { useMemo } from "react";
import { parseStateSchema } from "../utils/parser-utils.js";

export function useDocumentModelGlobalStateSchema(documentTypeId?: string) {
  const selectedDocumentModel = useDocumentModelModuleById(documentTypeId);

  const stateSchema = useMemo(() => {
    const schema =
      selectedDocumentModel?.specifications?.at(-1)?.state.global.schema;
    return schema ? parseStateSchema(schema) : undefined;
  }, [selectedDocumentModel]);

  return stateSchema;
}
