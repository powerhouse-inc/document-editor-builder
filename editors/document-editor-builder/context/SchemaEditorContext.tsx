import { createContext, useContext, useState, type ReactNode } from "react";

export interface SchemaEditorContextValue {
  // For editing action component (AddToPreviewDialog)
  editComponentId: string | null;
  setEditComponent: (
    componentId: string | null,
    actionId?: string | null
  ) => void;
  editComponentActionId: string | null;

  // Clear all edits
  clearEdit: () => void;

  // Hover state for drag interactions
  hoveredGroupId: string | null;
  setHoveredGroupId: (groupId: string | null) => void;
}

const SchemaEditorContext = createContext<SchemaEditorContextValue | undefined>(
  undefined
);

export function SchemaEditorProvider({ children }: { children: ReactNode }) {
  const [editComponentId, setEditComponentId] = useState<string | null>(null);
  const [editComponentActionId, setEditComponentActionId] = useState<
    string | null
  >(null);
  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null);

  const setEditComponent = (
    componentId: string | null,
    actionId?: string | null
  ) => {
    setEditComponentId(componentId);
    setEditComponentActionId(actionId ?? null);
  };

  const clearEdit = () => {
    setEditComponentId(null);
    setEditComponentActionId(null);
  };

  return (
    <SchemaEditorContext.Provider
      value={{
        editComponentId,
        editComponentActionId,
        setEditComponent,
        clearEdit,
        hoveredGroupId,
        setHoveredGroupId,
      }}
    >
      {children}
    </SchemaEditorContext.Provider>
  );
}

export function useSchemaEditor(): SchemaEditorContextValue {
  const context = useContext(SchemaEditorContext);
  if (!context) {
    throw new Error("useSchemaEditor must be used within SchemaEditorProvider");
  }
  return context;
}
