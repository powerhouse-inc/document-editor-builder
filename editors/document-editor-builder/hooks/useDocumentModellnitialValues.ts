import { useDocumentModelModuleById } from "@powerhousedao/reactor-browser";
import { useMemo } from "react";

export function useDocumentModelInitialValues(documentTypeId?: string) {
  const selectedDocumentModel = useDocumentModelModuleById(documentTypeId);

  const initialValues = useMemo(() => {
    const initialValue =
      selectedDocumentModel?.specifications?.at(-1)?.state.global.initialValue;
    return initialValue;
  }, [selectedDocumentModel]);

  return initialValues;
}
