import { pascalCase } from "change-case";

const generateBlankCustomComponentTemplate = (name: string) => {
  const componentName = pascalCase(name);

  return `import { type DocumentDispatch } from "@powerhousedao/reactor-browser";
import type { PHDocument } from "document-model";
import type { UseFormReturn } from "@powerhousedao/document-editor-builder/components";

interface CustomComponentProps {
  // Custom Component Config props
  name: string;
  path: string;

  // Form props if inside an action
  formProps?: UseFormReturn & {
    triggerSubmit: () => void;
    formId: string;
  };

  // Document
  document?: PHDocument;
  dispatch?: DocumentDispatch<any>;
}

export function ${componentName}({
  name,
  path,
  document,
  dispatch,
  formProps,
}: CustomComponentProps) {
  // Get the global state from the document
  // const globalState = (document?.state as DocumentState).global;

  // Dispatch an action to get the global state
  // dispatch?.({
  //     id: generateId(),
  //     timestampUtcMs: new Date().toISOString(),
  //     type: ACTION_NAME
  //     input: INPUT_PARAMS,
  //     scope: action?.scope || "global",
  //   });

  // If inside an action, access the form props
  // const name = formProps?.getValues("name");

  return (
    <div className="border border-gray-200 bg-[#F9F9F9] rounded-md p-4 text-center text-(--secondary)">
      You can build your custom component here: "./editors/custom-components/
      {path}"
      <br />
      <br />
      <strong>Get Global State:</strong> <br />
      <div className="text-left bg-gray-200 p-2 rounded-md max-w-[600px] mx-auto">
        <code className="text-left">
          const globalState = (previewDocument?.state as DocumentState).global;
          <br />
          console.log(globalState.name)
        </code>
      </div>
      <br />
      <strong>Dispatch Action:</strong> <br />
      <div className="text-left bg-gray-200 p-2 rounded-md max-w-[600px] mx-auto">
        <code className="whitespace-pre-wrap">
          {\`previewDispatch?.({
  id: generateId(),
  timestampUtcMs: new Date().toISOString(),
  type: ACTION_NAME,
  input: INPUT_PARAMS,
  scope: action?.scope || "global"
})\`}
        </code>
      </div>
    </div>
  );
}

export default ${componentName};
`;
};

export { generateBlankCustomComponentTemplate };
