import type { FieldDataType } from "../../../document-models/document-editor-builder/index.js";
import { z } from "zod";

export interface ParsedInputField {
  name: string;
  type: FieldDataType;
  optional: boolean;
  isArray: boolean;
  arrayItemRequired?: boolean; // If array, are the items required? (e.g., [String!])
  arrayDepth?: number; // How many levels of nesting (e.g., [[String]] would be 2)
  enumName?: string; // The name of the enum type
  enumOptions?: string[]; // The enum possible values
}

export interface ParsedInput {
  name: string;
  inputs: ParsedInputField[];
}

/**
 * Property definition for field components
 */
export interface PropDefinition {
  key: string;
  label: string;
  type: "String" | "Number" | "Boolean" | "Enum";
  enumOptions?: string[]; // For enum types, the available options
}

const EMPTY_FIELD_NAME = "_empty";

/**
 * Enum definition with name and values
 */
interface EnumDefinition {
  name: string;
  values: string[];
}

/**
 * Extract enum definitions from a GraphQL schema string
 * @param schema - Full GraphQL schema string
 * @returns Map of enum name to enum definition
 */
function extractEnums(schema: string): Map<string, EnumDefinition> {
  const enums = new Map<string, EnumDefinition>();
  const lines = schema.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const enumMatch = line.match(/^enum\s+(\w+)\s*\{?/);
    if (enumMatch) {
      const enumName = enumMatch[1];
      const values: string[] = [];

      // Check if opening brace is on the same line
      const hasOpeningBrace = line.includes("{");

      // Parse enum values until we find the closing brace
      // If opening brace is on same line, start from next line (i+1)
      // If opening brace is on next line, skip it too (i+2)
      let j = hasOpeningBrace ? i + 1 : i + 2;
      while (j < lines.length) {
        const valueLine = lines[j].trim();

        // Skip empty lines and comments
        if (!valueLine || valueLine.startsWith("#")) {
          j++;
          continue;
        }

        // Check for closing brace
        if (valueLine === "}" || valueLine.endsWith("}")) {
          // If closing brace is on same line as a value, extract the value first
          if (valueLine !== "}" && valueLine.endsWith("}")) {
            const value = valueLine.slice(0, -1).trim();
            if (value && !value.match(/^enum\s+\w+/) && !value.includes("{")) {
              values.push(value);
            }
          }
          break;
        }

        // Extract enum value (remove trailing comma if present)
        // Skip if it looks like an enum declaration or contains braces
        const value = valueLine.replace(/,$/, "").trim();
        if (
          value &&
          !value.match(/^enum\s+\w+/) &&
          !value.includes("{") &&
          !value.includes("}")
        ) {
          values.push(value);
        }

        j++;
      }

      // Filter out any values that look like enum declarations or contain braces
      const filteredValues = values.filter(
        (v) => !v.match(/^enum\s+\w+/) && !v.includes("{") && !v.includes("}")
      );

      enums.set(enumName, {
        name: enumName,
        values: filteredValues,
      });
    }
  }

  return enums;
}

/**
 * Parse a GraphQL type definition (the part after the colon)
 * Handles nested arrays, nullability, etc.
 * @param typeStr - Type definition string (e.g., "String!", "[String!]", "[[Int!]!]!")
 * @param enums - Map of enum definitions to check if a type is an enum
 */
function parseTypeDefinition(
  typeStr: string,
  enums?: Map<string, EnumDefinition>
): {
  type: FieldDataType;
  optional: boolean;
  isArray: boolean;
  arrayItemRequired?: boolean;
  arrayDepth?: number;
  enumName?: string;
  enumOptions?: string[];
} | null {
  let remaining = typeStr;
  let arrayDepth = 0;
  let arrayItemRequired: boolean | undefined;

  // Count opening brackets and track array depth
  while (remaining.startsWith("[")) {
    arrayDepth++;
    remaining = remaining.slice(1);
  }

  // Extract the base type
  const typeMatch = remaining.match(/^(\w+)(!?)/);
  if (!typeMatch) return null;

  const [, baseType, typeRequired] = typeMatch;
  remaining = remaining.slice(typeMatch[0].length);

  // Track if array items are required (the "!" immediately after the type)
  if (arrayDepth > 0) {
    arrayItemRequired = typeRequired === "!";
  }

  // Count closing brackets
  let closingBrackets = 0;
  while (remaining.startsWith("]")) {
    closingBrackets++;
    remaining = remaining.slice(1);
  }

  // Check if array/field itself is required (the "!" after all closing brackets)
  const fieldRequired = remaining === "!";

  // Validate bracket matching
  if (arrayDepth !== closingBrackets) {
    return null;
  }

  const isArray = arrayDepth > 0;

  // For arrays: optional if no "!" after the last closing bracket
  // For non-arrays: optional if no "!" after type
  const optional = isArray ? !fieldRequired : typeRequired !== "!";

  // Check if the type is an enum
  const enumDef = enums?.get(baseType);
  const isEnum = enumDef !== undefined;

  return {
    type: isEnum ? ("Enum" as const) : (baseType as FieldDataType),
    optional,
    isArray,
    arrayItemRequired: isArray ? arrayItemRequired : undefined,
    arrayDepth: isArray ? arrayDepth : undefined,
    enumName: isEnum ? enumDef.name : undefined,
    enumOptions: isEnum ? enumDef.values : undefined,
  };
}

/**
 * Parses a GraphQL input type definition into a structured object
 * @param schema - GraphQL input type definition string (can include full schema with enums)
 * @param fullSchema - Optional full schema string to extract enum names from
 * @returns Parsed input object with name and fields
 */
export const parseActionSchema = (
  schema: string,
  fullSchema?: string
): ParsedInput | null => {
  const lines = schema
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);

  if (lines.length === 0) return null;

  // Extract input name from first line (e.g., "input ChangeNameInput {")
  const inputNameMatch = lines[0].match(/input\s+(\w+)\s*\{?/);
  if (!inputNameMatch) return null;

  const inputName = inputNameMatch[1];
  const inputs: ParsedInputField[] = [];

  // Extract enum definitions from the schema (use fullSchema if provided, otherwise use schema)
  const enums = extractEnums(fullSchema || schema);

  // Parse each field
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    // Skip closing brace
    if (line === "}") continue;

    // Parse field name and type
    const fieldParts = line.match(/^(\w+)\s*:\s*(.+)$/);
    if (fieldParts) {
      const [, fieldName, typeDefinition] = fieldParts;

      // Parse the type definition to extract array depth, type, and nullability
      const parsed = parseTypeDefinition(typeDefinition.trim(), enums);

      if (parsed && fieldName !== EMPTY_FIELD_NAME) {
        inputs.push({
          name: fieldName,
          type: parsed.type,
          optional: parsed.optional,
          isArray: parsed.isArray,
          arrayItemRequired: parsed.arrayItemRequired,
          arrayDepth: parsed.arrayDepth,
          enumName: parsed.enumName,
          enumOptions: parsed.enumOptions,
        });
      }
    }
  }

  return {
    name: inputName,
    inputs,
  };
};

/**
 * Extracts a type definition from the schema
 * @param schema - Full GraphQL schema string
 * @param typeName - Name of the type to extract
 * @returns The type definition string or null if not found
 */
function extractTypeDefinition(
  schema: string,
  typeName: string
): string | null {
  const lines = schema.split("\n");
  let startIndex = -1;
  let braceCount = 0;

  // Find the start of the type definition
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const typeMatch = line.match(/^type\s+(\w+)\s*\{?/);
    if (typeMatch && typeMatch[1] === typeName) {
      startIndex = i;
      // Count opening brace if on same line
      if (line.includes("{")) {
        braceCount = 1;
      } else {
        braceCount = 0;
      }
      break;
    }
  }

  if (startIndex === -1) return null;

  // Extract the type definition until closing brace
  const typeLines: string[] = [];
  let i = startIndex;

  // Add the first line (type declaration)
  typeLines.push(lines[i]);

  // If opening brace was on the same line, start from next line
  if (braceCount > 0) {
    i++;
  } else {
    // Opening brace should be on next line
    i++;
    if (i < lines.length && lines[i].trim() === "{") {
      typeLines.push(lines[i]);
      i++;
    }
  }

  // Collect lines until we find the matching closing brace
  while (i < lines.length && braceCount > 0) {
    const line = lines[i];
    typeLines.push(line);

    // Count braces
    for (const char of line) {
      if (char === "{") braceCount++;
      if (char === "}") braceCount--;
    }

    i++;
  }

  return typeLines.join("\n");
}

/**
 * Parses a GraphQL state type definition into a structured object
 * e.g.,
 * type Form_1NameInputState {
 *   name: String!
 *   prefix: String
 *   isCoolName: Boolean
 * }
 * @param schema - GraphQL state type definition string (can include full schema with enums)
 * @param fullSchema - Optional full schema string to extract enum names from
 */
export const parseStateSchema = (
  schema: string,
  fullSchema?: string
): ParsedInput | null => {
  const schemaToSearch = fullSchema || schema;

  if (!schemaToSearch || schemaToSearch.trim().length === 0) return null;

  // Find the root state type (type ending with "State") in the original schema
  let rootTypeName: string | null = null;
  const schemaLines = schemaToSearch.split("\n");
  for (const line of schemaLines) {
    const trimmedLine = line.trim();
    const typeMatch = trimmedLine.match(/^type\s+(\w+)\s*\{?/);
    if (typeMatch && typeMatch[1].endsWith("State")) {
      rootTypeName = typeMatch[1];
      break;
    }
  }

  if (!rootTypeName) return null;

  // Extract only the root state type definition
  const rootTypeDefinition = extractTypeDefinition(
    schemaToSearch,
    rootTypeName
  );

  if (!rootTypeDefinition) return null;

  const lines = rootTypeDefinition
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);

  const inputs: ParsedInputField[] = [];

  // Extract enum definitions from the schema (use fullSchema if provided, otherwise use schema)
  const enums = extractEnums(schemaToSearch);

  // Parse each field of the root type only
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line === "}" || line === "{") continue;
    const fieldParts = line.match(/^(\w+)\s*:\s*(.+)$/);
    if (fieldParts) {
      const [, fieldName, typeDefinition] = fieldParts;
      const parsed = parseTypeDefinition(typeDefinition.trim(), enums);
      if (parsed) {
        // Only add fields that are not array item types
        // If it's an array, we keep the field but don't expand the array item type's fields
        inputs.push({
          name: fieldName,
          type: parsed.type,
          optional: parsed.optional,
          isArray: parsed.isArray,
          arrayItemRequired: parsed.arrayItemRequired,
          arrayDepth: parsed.arrayDepth,
          enumName: parsed.enumName,
          enumOptions: parsed.enumOptions,
        });
      }
    }
  }

  return {
    name: rootTypeName,
    inputs,
  };
};

/**
 * Get Tailwind CSS color classes for different GraphQL types
 * @param type - GraphQL type string
 * @returns Tailwind CSS classes for background, text, and border colors
 */
export function getTypeColor(type: FieldDataType): string {
  // Enum types
  if (type === "Enum") {
    return "bg-purple-100 text-purple-700 border border-purple-500";
  }

  // Boolean type
  if (type === "Boolean") {
    return "bg-orange-100 text-orange-700 border border-orange-500";
  }

  // Number types (Int, Float)
  if (type === "Int" || type === "Float") {
    return "bg-teal-100 text-teal-700 border border-teal-500";
  }

  // String type
  if (type === "String") {
    return "bg-blue-100 text-blue-700 border border-blue-500";
  }

  // Date/Time types
  if (type === "Date" || type === "DateTime") {
    return "bg-green-100 text-green-700 border border-green-500";
  }

  // Amount/Currency types
  if (type === "Amount" || type === "Currency") {
    return "bg-amber-100 text-amber-700 border border-amber-500";
  }

  // Address/Email types
  if (type === "EmailAddress") {
    return "bg-cyan-100 text-cyan-700 border border-cyan-500";
  }

  // Custom ID types
  if (type === "OID") {
    return "bg-indigo-100 text-indigo-700 border border-indigo-500";
  }

  // Upload/File types
  if (type === "Upload") {
    return "bg-rose-100 text-rose-700 border border-rose-500";
  }

  // Default
  return "bg-gray-100 text-gray-700 border border-gray-500";
}

/**
 * Convert camelCase to Title Case
 */
function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Extract property definitions from a Zod schema
 */
export function extractPropsFromSchema(
  schema: z.ZodTypeAny,
  labelOverrides: Record<string, string> = {}
): PropDefinition[] {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const shape = (schema as z.ZodObject<any>).shape;
  const props: PropDefinition[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  for (const [key, value] of Object.entries(shape)) {
    const zodType = value as z.ZodTypeAny;
    const label = labelOverrides[key] || formatLabel(key);

    // Extract the inner type from nullish/optional wrappers
    let innerType: z.ZodTypeAny = zodType;
    if ("_def" in zodType && zodType._def && typeof zodType._def === "object") {
      const def = zodType._def;

      if (def && "innerType" in def && def.innerType) {
        innerType = def.innerType as z.ZodTypeAny;
      }
    }

    // Determine the property type and extract enum options if applicable
    let propType: "String" | "Number" | "Boolean" | "Enum" = "String";
    let enumOptions: string[] | undefined;

    if (innerType instanceof z.ZodNumber) {
      propType = "Number";
    } else if (innerType instanceof z.ZodBoolean) {
      propType = "Boolean";
    } else if (innerType instanceof z.ZodEnum) {
      propType = "Enum";
      // Extract enum options from ZodEnum
       
      const enumValues = innerType.options;
      if (Array.isArray(enumValues)) {
        enumOptions = enumValues.filter(
          (v): v is string => typeof v === "string"
        );
      }
    } else if (
      "_def" in innerType &&
      innerType._def &&
      typeof innerType._def === "object"
    ) {
      // Check if it's a ZodNativeEnum or other enum-like type
      const def = innerType._def as {
        typeName?: string;
        values?: unknown;
      };
      if (def.typeName === "ZodEnum" && Array.isArray(def.values)) {
        propType = "Enum";
        enumOptions = def.values.filter(
          (v): v is string => typeof v === "string"
        );
      } else if (def.typeName === "ZodNativeEnum") {
        propType = "Enum";
        // For native enums, extract values from the enum object
        const enumObject = def.values;
        if (enumObject && typeof enumObject === "object") {
          enumOptions = Object.values(enumObject).filter(
            (v): v is string => typeof v === "string"
          );
        }
      }
    }

    props.push({ key, label, type: propType, enumOptions });
  }

  return props.filter((prop) => prop.key !== "__typename");
}
