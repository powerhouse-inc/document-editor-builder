import { generateMock } from "@powerhousedao/codegen";
import { describe, expect, it } from "vitest";
import {
  reducer,
  utils,
  isDocumentEditorBuilderDocument,
  editTheme,
  editRootGroupProps,
  EditThemeInputSchema,
  EditRootGroupPropsInputSchema,
} from "@powerhousedao/document-editor-builder/document-models/document-editor-builder";

describe("ThemeOperations", () => {
  it("should handle editTheme operation", () => {
    const document = utils.createDocument();
    const input = generateMock(EditThemeInputSchema());

    const updatedDocument = reducer(document, editTheme(input));

    expect(isDocumentEditorBuilderDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe("EDIT_THEME");
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle editRootGroupProps operation", () => {
    const document = utils.createDocument();
    const input = generateMock(EditRootGroupPropsInputSchema());

    const updatedDocument = reducer(document, editRootGroupProps(input));

    expect(isDocumentEditorBuilderDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "EDIT_ROOT_GROUP_PROPS",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
