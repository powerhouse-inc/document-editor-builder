const generateTemplate = (documentType: string) => {
  return `
import { DocumentToolbar } from "@powerhousedao/design-system/connect";
import { useEffect, useState } from "react";
import type {
  EditorComponent,
  GroupComponentConfig,
  Theme,
} from "@powerhousedao/document-editor-builder/document-models/document-editor-builder";
import {
  UiSchemaPreview,
  SchemaEditorProvider,
  ThemeConfigurator,
} from "@powerhousedao/document-editor-builder/components";
import { useSelectedDocument } from "@powerhousedao/reactor-browser";

export default function Editor() {
  const [document, dispatch] = useSelectedDocument();

  const [schema, setSchema] = useState<Array<EditorComponent> | null>(null);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [groupProps, setGroupProps] = useState<GroupComponentConfig | null>(null);
  useEffect(() => {
    // Load schema via fetch to avoid JSON module assertion/runtime MIME issues
    const schemaUrl = new URL("./schema.json", import.meta.url);
    fetch(schemaUrl)
      .then((res) => res.json())
      .then((json: { schema: Array<EditorComponent>; theme: Theme; groupProps: GroupComponentConfig }) => {
        setSchema(json.schema);
        setTheme(json.theme);
        setGroupProps(json.groupProps);
      });
  }, []);

  return (
    <div className="h-full bg-(--background) text-(--foreground)">
      <div className="pt-4 px-4">
        <DocumentToolbar />
      </div>

      <ThemeConfigurator theme={theme} />

      {/* Set Schema Preview */}
      <div className="">
        <SchemaEditorProvider>
          <div>
            {schema ? (
              <UiSchemaPreview
                documentType={'${documentType}'}
                schema={schema}
                previewDocument={document}
                previewDispatch={dispatch}
                groupProps={groupProps}
              />
            ) : null}
          </div>
        </SchemaEditorProvider>
      </div>
    </div>
  );
}
`;
};

export { generateTemplate };
