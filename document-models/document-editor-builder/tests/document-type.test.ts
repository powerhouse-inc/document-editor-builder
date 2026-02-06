import { generateMock } from "@powerhousedao/codegen";
import { describe, expect, it } from "vitest";
import {
  reducer,
  utils,
  isDocumentEditorBuilderDocument,
  setDocumentType,
  setNewDocumentName,
  SetDocumentTypeInputSchema,
  SetNewDocumentNameInputSchema,
} from "@powerhousedao/document-editor-builder/document-models/document-editor-builder";

describe("DocumentTypeOperations", () => {
  it("should handle setDocumentType operation", () => {
    const document = utils.createDocument();
    const input = generateMock(SetDocumentTypeInputSchema());

    const updatedDocument = reducer(document, setDocumentType(input));

    expect(isDocumentEditorBuilderDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SET_DOCUMENT_TYPE",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle setNewDocumentName operation", () => {
    const document = utils.createDocument();
    const input = generateMock(SetNewDocumentNameInputSchema());

    const updatedDocument = reducer(document, setNewDocumentName(input));

    expect(isDocumentEditorBuilderDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SET_NEW_DOCUMENT_NAME",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
