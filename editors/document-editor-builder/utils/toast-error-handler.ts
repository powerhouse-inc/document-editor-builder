import { toast } from "sonner";
import {
  ErrorType,
  normalizeError as normalizeErrorUtil,
  type NormalizedError,
} from "./errors.js";

/**
 * Maps error types to toast messages
 */
export function showErrorToast(error: NormalizedError): void {
  const { type, message, operation } = error;

  switch (type) {
    case ErrorType.COMPONENT_NOT_FOUND:
      toast.error("Component not found", {
        description: message,
      });
      break;

    case ErrorType.GROUP_NOT_FOUND:
      toast.error("Group not found", {
        description: message,
      });
      break;

    case ErrorType.INVALID_COMPONENT_TYPE:
      toast.error("Invalid component type", {
        description: message,
      });
      break;

    case ErrorType.INVALID_OPERATION:
      toast.error("Invalid operation", {
        description: message,
      });
      break;

    case ErrorType.VALIDATION_ERROR:
      toast.error("Validation error", {
        description: message,
      });
      break;

    case ErrorType.UNKNOWN_ERROR:
    default:
      toast.error(operation ? `Error in ${operation}` : "An error occurred", {
        description: message,
      });
      break;
  }
}

/**
 * Parses error message to determine error type
 */
function parseErrorFromMessage(
  message: string,
  operation?: string
): NormalizedError | null {
  // Component not found patterns
  if (message.includes("Component with id") && message.includes("not found")) {
    const match = message.match(/Component with id ([^\s]+) not found/);
    return {
      type: ErrorType.COMPONENT_NOT_FOUND,
      message,
      operation,
      componentId: match?.[1],
    };
  }

  // Group not found patterns
  if (
    (message.includes("Group component") || message.includes("Group")) &&
    message.includes("not found")
  ) {
    const match = message.match(
      /(?:Group component with id|Group) ([^\s]+) not found/
    );
    return {
      type: ErrorType.GROUP_NOT_FOUND,
      message,
      operation,
      componentId: match?.[1],
    };
  }

  // Invalid component type patterns
  if (message.includes("is not a") || message.includes("Invalid component")) {
    const match = message.match(/Component with id ([^\s]+)/);
    return {
      type: ErrorType.INVALID_COMPONENT_TYPE,
      message,
      operation,
      componentId: match?.[1],
    };
  }

  // Invalid operation patterns
  if (message.includes("Cannot add") || message.includes("Invalid operation")) {
    return {
      type: ErrorType.INVALID_OPERATION,
      message,
      operation,
    };
  }

  // Validation error patterns
  if (
    message.includes("missing required fields") ||
    message.includes("Validation")
  ) {
    return {
      type: ErrorType.VALIDATION_ERROR,
      message,
      operation,
    };
  }

  return null;
}

/**
 * Handles multiple errors and shows toast for each
 */
export function handleErrors(errors: Error[], operation?: string): void {
  errors.forEach((error) => {
    let normalized: NormalizedError;

    // First try to normalize using the utility (works for DocumentEditorBuilderError instances)
    const utilNormalized = normalizeErrorUtil(error, operation);

    // If it's an unknown error, try parsing the message
    if (
      utilNormalized.type === ErrorType.UNKNOWN_ERROR &&
      error instanceof Error
    ) {
      const parsed = parseErrorFromMessage(error.message, operation);
      normalized = parsed || utilNormalized;
    } else {
      normalized = utilNormalized;
    }

    showErrorToast(normalized);
  });
}
