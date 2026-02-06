import { useDocumentModelModuleById } from "@powerhousedao/reactor-browser";
import { useMemo } from "react";

export function useDocumentModelModules(documentTypeId?: string) {
  const selectedDocumentModel = useDocumentModelModuleById(documentTypeId);

  const modules = useMemo(() => {
    return selectedDocumentModel?.specifications?.at(-1)?.modules || [];
  }, [selectedDocumentModel]);

  return modules;
}
