import { setName } from "document-model";
import type { FormEventHandler, MouseEventHandler } from "react";
import { useState } from "react";
import { useSelectedDocumentEditorBuilderDocument } from "@powerhousedao/document-editor-builder/document-models/document-editor-builder";

/** Displays the name of the selected DocumentEditorBuilder document and allows editing it */
export function EditDocumentEditorBuilderName() {
  const [documentEditorBuilderDocument, dispatch] =
    useSelectedDocumentEditorBuilderDocument();
  const [isEditing, setIsEditing] = useState(false);

  if (!documentEditorBuilderDocument) return null;

  const documentEditorBuilderDocumentName =
    documentEditorBuilderDocument.header.name;

  const onClickEditDocumentEditorBuilderName: MouseEventHandler<
    HTMLButtonElement
  > = () => {
    setIsEditing(true);
  };

  const onClickCancelEditDocumentEditorBuilderName: MouseEventHandler<
    HTMLButtonElement
  > = () => {
    setIsEditing(false);
  };

  const onSubmitSetName: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    const name = nameInput.value;
    if (!name) return;

    dispatch(setName(name));
    setIsEditing(false);
  };

  if (isEditing)
    return (
      <form
        className="flex gap-2 items-center justify-between"
        onSubmit={onSubmitSetName}
      >
        <input
          className="text-lg font-semibold text-gray-900 p-1"
          type="text"
          name="name"
          defaultValue={documentEditorBuilderDocumentName}
          autoFocus
        />
        <div className="flex gap-2">
          <button type="submit" className="text-sm text-gray-600">
            Save
          </button>
          <button
            className="text-sm text-red-800"
            onClick={onClickCancelEditDocumentEditorBuilderName}
          >
            Cancel
          </button>
        </div>
      </form>
    );

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold text-gray-900">
        {documentEditorBuilderDocumentName}
      </h2>
      <button
        className="text-sm text-gray-600"
        onClick={onClickEditDocumentEditorBuilderName}
      >
        Edit Name
      </button>
    </div>
  );
}
