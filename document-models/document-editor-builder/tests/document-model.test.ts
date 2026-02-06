/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */
/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect } from "vitest";
import {
  utils,
  initialGlobalState,
  initialLocalState,
  documentEditorBuilderDocumentType,
  isDocumentEditorBuilderDocument,
  assertIsDocumentEditorBuilderDocument,
  isDocumentEditorBuilderState,
  assertIsDocumentEditorBuilderState,
} from "@powerhousedao/document-editor-builder/document-models/document-editor-builder";
import { ZodError } from "zod";

describe("DocumentEditorBuilder Document Model", () => {
  it("should create a new DocumentEditorBuilder document", () => {
    const document = utils.createDocument();

    expect(document).toBeDefined();
    expect(document.header.documentType).toBe(
      documentEditorBuilderDocumentType
    );
  });

  it("should create a new DocumentEditorBuilder document with a valid initial state", () => {
    const document = utils.createDocument();
    expect(document.state.global).toStrictEqual(initialGlobalState);
    expect(document.state.local).toStrictEqual(initialLocalState);
    expect(isDocumentEditorBuilderDocument(document)).toBe(true);
    expect(isDocumentEditorBuilderState(document.state)).toBe(true);
  });
  it("should reject a document that is not a DocumentEditorBuilder document", () => {
    const wrongDocumentType = utils.createDocument();
    wrongDocumentType.header.documentType = "the-wrong-thing-1234";
    try {
      expect(
        assertIsDocumentEditorBuilderDocument(wrongDocumentType)
      ).toThrow();
      expect(isDocumentEditorBuilderDocument(wrongDocumentType)).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
    }
  });
  const wrongState = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  wrongState.state.global = {
    ...{ notWhat: "you want" },
  };
  try {
    expect(isDocumentEditorBuilderState(wrongState.state)).toBe(false);
    expect(assertIsDocumentEditorBuilderState(wrongState.state)).toThrow();
    expect(isDocumentEditorBuilderDocument(wrongState)).toBe(false);
    expect(assertIsDocumentEditorBuilderDocument(wrongState)).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }

  const wrongInitialState = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  wrongInitialState.initialState.global = {
    ...{ notWhat: "you want" },
  };
  try {
    expect(isDocumentEditorBuilderState(wrongInitialState.state)).toBe(false);
    expect(
      assertIsDocumentEditorBuilderState(wrongInitialState.state)
    ).toThrow();
    expect(isDocumentEditorBuilderDocument(wrongInitialState)).toBe(false);
    expect(assertIsDocumentEditorBuilderDocument(wrongInitialState)).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }

  const missingIdInHeader = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  delete missingIdInHeader.header.id;
  try {
    expect(isDocumentEditorBuilderDocument(missingIdInHeader)).toBe(false);
    expect(assertIsDocumentEditorBuilderDocument(missingIdInHeader)).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }

  const missingNameInHeader = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  delete missingNameInHeader.header.name;
  try {
    expect(isDocumentEditorBuilderDocument(missingNameInHeader)).toBe(false);
    expect(
      assertIsDocumentEditorBuilderDocument(missingNameInHeader)
    ).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }

  const missingCreatedAtUtcIsoInHeader = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  delete missingCreatedAtUtcIsoInHeader.header.createdAtUtcIso;
  try {
    expect(
      isDocumentEditorBuilderDocument(missingCreatedAtUtcIsoInHeader)
    ).toBe(false);
    expect(
      assertIsDocumentEditorBuilderDocument(missingCreatedAtUtcIsoInHeader)
    ).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }

  const missingLastModifiedAtUtcIsoInHeader = utils.createDocument();
  // @ts-expect-error - we are testing the error case
  delete missingLastModifiedAtUtcIsoInHeader.header.lastModifiedAtUtcIso;
  try {
    expect(
      isDocumentEditorBuilderDocument(missingLastModifiedAtUtcIsoInHeader)
    ).toBe(false);
    expect(
      assertIsDocumentEditorBuilderDocument(missingLastModifiedAtUtcIsoInHeader)
    ).toThrow();
  } catch (error) {
    expect(error).toBeInstanceOf(ZodError);
  }
});
