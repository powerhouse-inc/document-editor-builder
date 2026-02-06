/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect } from "vitest";
import { initialGlobalState, initialLocalState } from "../../gen/utils.js";
import { utils } from "../../utils.js";
describe("Document Editor Builder Document Model", () => {
  it("should create a new Document Editor Builder document", () => {
    const document = utils.createDocument();

    expect(document).toBeDefined();
    expect(document.header.documentType).toBe(
      "powerhouse/document-editor-builder",
    );
  });

  it("should create a new Document Editor Builder document with a valid initial state", () => {
    const document = utils.createDocument();
    expect(document.state.global).toStrictEqual(initialGlobalState);
    expect(document.state.local).toStrictEqual(initialLocalState);
  });
});
