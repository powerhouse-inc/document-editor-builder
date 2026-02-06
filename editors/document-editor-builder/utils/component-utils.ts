import type { EditorComponent } from "../../../document-models/document-editor-builder/gen/types.js";

/**
 * Checks if a component has an action component as a parent in the schema hierarchy
 */
export function hasParentAction(
  component: EditorComponent,
  schemaComponents?: Array<EditorComponent>
): boolean {
  if (!schemaComponents || !component.groupId) {
    return false;
  }

  const checkRecursive = (
    currentGroupId: string,
    visited: Set<string> = new Set()
  ): boolean => {
    // Prevent infinite loops from circular references
    if (visited.has(currentGroupId)) {
      return false;
    }
    visited.add(currentGroupId);

    const parentComponent = schemaComponents?.find(
      (c) => c.id === currentGroupId
    );

    if (!parentComponent) {
      return false;
    }

    // If the parent is an action, we found it
    if (parentComponent.type === "action") {
      return true;
    }

    // If the parent has a groupId, recursively check its parent
    if (parentComponent.groupId) {
      return checkRecursive(parentComponent.groupId, visited);
    }

    return false;
  };

  return checkRecursive(component.groupId);
}

/**
 * Gets all child components recursively from a main component.
 * Returns a flat list of all components that are nested at any depth below the main component.
 */
export function allChildComponents(
  component: EditorComponent,
  schemaComponents?: Array<EditorComponent>
): Array<EditorComponent> {
  if (!schemaComponents) {
    return [];
  }

  const allChildren: Array<EditorComponent> = [];
  const visited = new Set<string>();

  const collectRecursive = (parentId: string) => {
    // Prevent infinite loops from circular references
    if (visited.has(parentId)) {
      return;
    }
    visited.add(parentId);

    // Find all direct children of the parent component
    const directChildren = schemaComponents.filter(
      (c) => c.groupId === parentId
    );

    // Add direct children to the result
    allChildren.push(...directChildren);

    // Recursively collect children of each child component
    directChildren.forEach((child) => {
      collectRecursive(child.id);
    });
  };

  collectRecursive(component.id);

  return allChildren;
}
