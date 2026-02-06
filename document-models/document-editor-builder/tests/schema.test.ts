import { describe, expect, it } from "vitest";
import {
  reducer,
  utils,
  isDocumentEditorBuilderDocument,
  setSchema,
  resetSchema,
  ResetSchemaInputSchema,
} from "@powerhousedao/document-editor-builder/document-models/document-editor-builder";
import { generateMock } from "@powerhousedao/codegen";
import {
  createContentComponent,
  createSpacerComponent,
} from "./components.test.js";

describe("SchemaOperations", () => {
  it("should handle setSchema operation", () => {
    const document = utils.createDocument();
    const input = {
      schema: [
        createSpacerComponent("spacer-1"),
        createContentComponent("content-1"),
      ],
    };

    const updatedDocument = reducer(document, setSchema(input));

    expect(isDocumentEditorBuilderDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe("SET_SCHEMA");
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle resetSchema operation", () => {
    const document = utils.createDocument();
    const input = generateMock(ResetSchemaInputSchema());

    const updatedDocument = reducer(document, resetSchema(input));

    expect(isDocumentEditorBuilderDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "RESET_SCHEMA",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
