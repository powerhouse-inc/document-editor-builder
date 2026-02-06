/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import {
  reducer,
  utils,
  isDocumentEditorBuilderDocument,
  editTheme,
  editRootGroupProps,
  EditThemeInputSchema,
} from "@powerhousedao/document-editor-builder/document-models/document-editor-builder";

describe("Theme Operations", () => {
  it("should handle editTheme operation", () => {
    const document = utils.createDocument();
    const input = generateMock(EditThemeInputSchema());

    const updatedDocument = reducer(document, editTheme(input));

    expect(isDocumentEditorBuilderDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe("EDIT_THEME");
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle editRootGroupProps operation", () => {
    const document = utils.createDocument();

    const updatedDocument = reducer(
      document,
      editRootGroupProps({
        layout: "row",
        gap: 24,
        paddingTop: 4,
        minWidth: 120,
      })
    );

    expect(updatedDocument.state.global.groupProps).toMatchObject({
      layout: "row",
      gap: 24,
      paddingTop: 4,
      minWidth: 120,
    });
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "EDIT_ROOT_GROUP_PROPS"
    );
  });

  it("should treat undefined as no-op and null as reset for root props", () => {
    const document = utils.createDocument();

    const seeded = reducer(
      document,
      editRootGroupProps({
        layout: "row",
        gap: 12,
        minWidth: 80,
      })
    );

    const updated = reducer(
      seeded,
      editRootGroupProps({
        layout: undefined,
        gap: undefined,
        minWidth: null,
      })
    );

    expect(updated.state.global.groupProps).toMatchObject({
      layout: "row",
      gap: 12,
      minWidth: null,
    });
  });
});
