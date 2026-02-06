/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect, beforeEach } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import {
  SetDocumentTypeInputSchema,
  SetNewDocumentNameInputSchema,
  type SetDocumentTypeInput,
  type SetNewDocumentNameInput,
} from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/document-type/creators.js";
import type {
  DocumentEditorBuilderDocument,
  EditorComponent,
} from "../../gen/types.js";
import { utils } from "../../utils.js";

describe("DocumentType Operations", () => {
  let document: DocumentEditorBuilderDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle setDocumentType operation", () => {
    const input: SetDocumentTypeInput = generateMock(
      SetDocumentTypeInputSchema(),
    );

    const updatedDocument = reducer(document, creators.setDocumentType(input));

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
    const input: SetNewDocumentNameInput = generateMock(
      SetNewDocumentNameInputSchema()
    );

    const updatedDocument = reducer(
      document,
      creators.setNewDocumentName(input)
    );

    expect(updatedDocument.state.global.documentName).toBe(input.name);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SET_NEW_DOCUMENT_NAME"
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input
    );
  });

  it("clears schema and name when documentType becomes null", () => {
    const baseGlobal = utils.createState().global;
    const seededDocument = utils.createDocument({
      global: {
        ...baseGlobal,
        documentType: "powerhouse/test",
        documentName: "Test Document",
        schema: [
          {
            id: "component-1",
            type: "content",
            control: "label",
            groupId: null,
            config: {
              label: "Label",
              scope: null,
              scopeDataType: null,
              text: "Text",
              contentFormat: null,
            },
          } satisfies EditorComponent,
        ],
      },
    });

    const updatedDocument = reducer(
      seededDocument,
      creators.setDocumentType({ documentType: null, documentName: null })
    );

    expect(updatedDocument.state.global.documentType).toBeNull();
    expect(updatedDocument.state.global.documentName).toBe("");
    expect(updatedDocument.state.global.schema).toEqual([]);
  });

  it("clears schema when documentType changes", () => {
    const baseGlobal = utils.createState().global;
    const seededDocument = utils.createDocument({
      global: {
        ...baseGlobal,
        documentType: "powerhouse/one",
        documentName: "Doc One",
        schema: [
          {
            id: "component-1",
            type: "content",
            control: "label",
            groupId: null,
            config: {
              label: "Label",
              scope: null,
              scopeDataType: null,
              text: "Text",
              contentFormat: null,
            },
          } satisfies EditorComponent,
        ],
      },
    });

    const updatedDocument = reducer(
      seededDocument,
      creators.setDocumentType({ documentType: "powerhouse/two", documentName: "Doc Two" })
    );

    expect(updatedDocument.state.global.documentType).toBe("powerhouse/two");
    expect(updatedDocument.state.global.documentName).toBe("Doc Two");
    expect(updatedDocument.state.global.schema).toEqual([]);
  });
});
