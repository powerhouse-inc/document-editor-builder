/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect, beforeEach } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import { AddActionComponentInputSchema, type AddActionComponentInput } from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/components/creators.js";
import type { DocumentEditorBuilderDocument } from "../../gen/types.js";
import { utils } from "../../utils.js";

describe("Components Operations", () => {
  let document: DocumentEditorBuilderDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle addActionComponent operation", () => {
    const input: AddActionComponentInput = generateMock(
      AddActionComponentInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.addActionComponent(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "ADD_ACTION_COMPONENT",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
