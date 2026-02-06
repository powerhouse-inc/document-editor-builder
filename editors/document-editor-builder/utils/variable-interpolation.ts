/**
 * Interpolates variables in text using ${variableName} syntax
 * Replaces ${variableName} with the value from document state if available
 */
export function interpolateVariables(
  text: string,
  documentState?: Record<string, unknown>
): string {
  if (!text || !documentState) {
    return text;
  }

  // Match ${variableName} pattern
  return text.replace(/\$\{([^}]+)\}/g, (match, variableName) => {
    const value = documentState[variableName as keyof typeof documentState];
    if (value === null || value === undefined) {
      return match; // Keep original if variable not found
    }
    return value as string;
  });
}

/**
 * Extracts all variable names from text using ${variableName} syntax
 */
export function extractVariables(text: string): string[] {
  if (!text) return [];
  const matches = text.matchAll(/\$\{([^}]+)\}/g);
  return Array.from(matches, (match) => match[1].trim());
}

/**
 * Checks if a variable name exists in the document state schema
 */
export function isValidVariable(
  variableName: string,
  availableFields: string[]
): boolean {
  return availableFields.includes(variableName);
}
