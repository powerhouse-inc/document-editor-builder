/**
 * Normalized error types for document-editor-builder operations
 */
export enum ErrorType {
  COMPONENT_NOT_FOUND = "COMPONENT_NOT_FOUND",
  GROUP_NOT_FOUND = "GROUP_NOT_FOUND",
  INVALID_COMPONENT_TYPE = "INVALID_COMPONENT_TYPE",
  INVALID_OPERATION = "INVALID_OPERATION",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export interface NormalizedError {
  type: ErrorType;
  message: string;
  operation?: string;
  componentId?: string;
}

/**
 * Custom error class for normalized errors
 */
export class DocumentEditorBuilderError extends Error {
  public readonly errorType: ErrorType;
  public readonly operation?: string;
  public readonly componentId?: string;

  constructor(
    errorType: ErrorType,
    message: string,
    operation?: string,
    componentId?: string
  ) {
    super(message);
    this.name = "DocumentEditorBuilderError";
    this.errorType = errorType;
    this.operation = operation;
    this.componentId = componentId;
  }

  toNormalizedError(): NormalizedError {
    return {
      type: this.errorType,
      message: this.message,
      operation: this.operation,
      componentId: this.componentId,
    };
  }
}

/**
 * Helper functions to create specific error types
 */
export const Errors = {
  componentNotFound: (componentId: string, operation?: string) =>
    new DocumentEditorBuilderError(
      ErrorType.COMPONENT_NOT_FOUND,
      `Component with id ${componentId} not found`,
      operation,
      componentId
    ),

  groupNotFound: (groupId: string, operation?: string) =>
    new DocumentEditorBuilderError(
      ErrorType.GROUP_NOT_FOUND,
      `Group component with id ${groupId} not found`,
      operation,
      groupId
    ),

  invalidComponentType: (
    componentId: string,
    expectedType: string,
    actualType: string,
    operation?: string
  ) =>
    new DocumentEditorBuilderError(
      ErrorType.INVALID_COMPONENT_TYPE,
      `Component with id ${componentId} is not a ${expectedType}. Found: ${actualType}`,
      operation,
      componentId
    ),

  invalidOperation: (message: string, operation?: string) =>
    new DocumentEditorBuilderError(
      ErrorType.INVALID_OPERATION,
      message,
      operation
    ),

  validationError: (message: string, operation?: string) =>
    new DocumentEditorBuilderError(
      ErrorType.VALIDATION_ERROR,
      message,
      operation
    ),
};

/**
 * Normalizes any error to a NormalizedError
 */
export function normalizeError(
  error: unknown,
  operation?: string
): NormalizedError {
  if (error instanceof DocumentEditorBuilderError) {
    return error.toNormalizedError();
  }

  if (error instanceof Error) {
    return {
      type: ErrorType.UNKNOWN_ERROR,
      message: error.message,
      operation,
    };
  }

  return {
    type: ErrorType.UNKNOWN_ERROR,
    message: String(error),
    operation,
  };
}
