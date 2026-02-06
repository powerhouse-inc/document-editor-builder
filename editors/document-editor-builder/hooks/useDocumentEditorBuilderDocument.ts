import {
  dispatchActions,
  useDocumentOfType,
  useSelectedDocumentOfType,
} from "@powerhousedao/reactor-browser";
import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import type { PHDocument } from "document-model";
import type {
  DocumentEditorBuilderAction,
  DocumentEditorBuilderDocument,
} from "../../../document-models/document-editor-builder/index.js";
import { handleErrors } from "../utils/toast-error-handler.js";

export function useDocumentEditorBuilderDocument(
  documentId: string | null | undefined
) {
  return useDocumentOfType<
    DocumentEditorBuilderDocument,
    DocumentEditorBuilderAction
  >(documentId, "powerhouse/document-editor-builder");
}

export interface DispatchOptions {
  skipToast?: boolean;
  onError?: (errors: Error[]) => void;
  onSuccess?: (result: PHDocument) => void;
}

type ActionOrActions =
  | DocumentEditorBuilderAction[]
  | DocumentEditorBuilderAction
  | undefined;

type DispatchFunction = DocumentDispatch<DocumentEditorBuilderAction> &
  ((actionOrActions: ActionOrActions, options?: DispatchOptions) => void);

export function useSelectedDocumentEditorBuilderDocument() {
  const documentOfType = useSelectedDocumentOfType<
    DocumentEditorBuilderDocument,
    DocumentEditorBuilderAction
  >("powerhouse/document-editor-builder");

  const dispatch = ((
    actionOrActions: ActionOrActions,
    onErrorsOrOptions?:
      | DispatchOptions
      | ((errors: Error[]) => void),
    onSuccess?: (result: PHDocument) => void
  ) => {
    const options: DispatchOptions | undefined =
      typeof onErrorsOrOptions === "object" && onErrorsOrOptions
        ? onErrorsOrOptions
        : undefined;
    const onErrors =
      typeof onErrorsOrOptions === "function"
        ? onErrorsOrOptions
        : options?.onError;
    const onSuccessCallback = options?.onSuccess ?? onSuccess;
    const errors: Error[] = [];
    dispatchActions(actionOrActions, documentOfType[0]).then((result) => {
      (Array.isArray(actionOrActions)
        ? actionOrActions
        : [actionOrActions]
      ).forEach((action) => {
        if (action) {
          const error = result?.operations[action.scope].find(
            (o) => o.action?.id === action.id
          )?.error;
          if (error) {
            errors.push(new Error(error));
          }
        }
      });
      if (errors.length > 0) {
        // Show toast notifications unless skipped
        if (!options?.skipToast) {
          handleErrors(
            errors,
            actionOrActions
              ? Array.isArray(actionOrActions)
                ? actionOrActions[0]?.type
                : actionOrActions.type
              : undefined
          );
        }
        // Call custom error callback if provided
        onErrors?.(errors);
      }
      if (result) {
        onSuccessCallback?.(result);
      }
    });
  }) as DispatchFunction;

  return [documentOfType[0], dispatch] as const;
}
