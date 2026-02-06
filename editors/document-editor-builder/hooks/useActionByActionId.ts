import { useDocumentModelModuleById } from "@powerhousedao/reactor-browser";
import type { OperationSpecification } from "document-model";
import { useMemo } from "react";

export function useActionByActionId(
  actionId?: string,
  documentTypeId?: string
): OperationSpecification | undefined {
  const selectedDocumentModel = useDocumentModelModuleById(documentTypeId);

  const modules = useMemo(() => {
    return selectedDocumentModel?.specifications?.at(-1)?.modules || [];
  }, [selectedDocumentModel]);

  const action = useMemo(() => {
    if (!actionId) return undefined;
    for (const mod of modules) {
      const found = (mod.operations || []).find((op) => op.id === actionId);
      if (found) return found;
    }
    return undefined;
  }, [modules, actionId]);

  return action;
}

export default useActionByActionId;
