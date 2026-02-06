/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect, beforeEach } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import {
  ResetSchemaInputSchema,
  SetSchemaInputSchema,
  type ResetSchemaInput,
  type SetSchemaInput,
} from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/schema/creators.js";
import type {
  DocumentEditorBuilderDocument,
  EditorComponent,
} from "../../gen/types.js";
import { utils } from "../../utils.js";

describe("Schema Operations", () => {
  let document: DocumentEditorBuilderDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle setSchema operation", () => {
    const input: SetSchemaInput = generateMock(SetSchemaInputSchema());

    const updatedDocument = reducer(document, creators.setSchema(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe("SET_SCHEMA");
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should handle resetSchema operation", () => {
    const baseGlobal = utils.createState().global;
    const seededDocument = utils.createDocument({
      global: {
        ...baseGlobal,
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
    const input: ResetSchemaInput = generateMock(ResetSchemaInputSchema());

    const updatedDocument = reducer(seededDocument, creators.resetSchema(input));

    expect(updatedDocument.state.global.schema).toEqual([]);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe("RESET_SCHEMA");
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
