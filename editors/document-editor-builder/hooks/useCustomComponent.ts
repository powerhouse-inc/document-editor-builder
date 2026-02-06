import { getConfig } from "@powerhousedao/config/node";
import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import type { PHDocument } from "document-model";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import type { CustomComponentConfig } from "../../../document-models/document-editor-builder/index.js";
import type { UseFormReturn } from "@powerhousedao/document-editor-builder/components";

type CustomComponentProps = {
  name: string;
  path: string;
  document?: PHDocument;
  dispatch?: DocumentDispatch<any>;
  formProps?: UseFormReturn & {
    triggerSubmit: () => void;
    formId: string;
  };
};

function useCustomPath(customConfig: CustomComponentConfig | undefined) {
  return useMemo(() => {
    if (!customConfig?.path) {
      return null;
    }

    const config = getConfig();
    const configuredEditorsDir = config.editorsDir || "./editors";

    const normalizedEditorsDir = configuredEditorsDir
      .replace(/^\.\//, "")
      .replace(/\/$/, "");
    const currentModuleDir = decodeURIComponent(
      new URL(".", import.meta.url).pathname
    );
    const editorsDirPattern = `/${normalizedEditorsDir}/`;
    const editorsDirIndex = currentModuleDir.lastIndexOf(editorsDirPattern);

    let customDir = `../../custom-components`;

    if (editorsDirIndex !== -1) {
      const pathAfterEditors = currentModuleDir
        .slice(editorsDirIndex + editorsDirPattern.length)
        .split("/")
        .filter(Boolean);
      const upSegments = pathAfterEditors.length;
      const relativeToEditors =
        upSegments > 0 ? Array(upSegments).fill("..").join("/") : ".";
      customDir =
        relativeToEditors === "."
          ? `./custom-components`
          : `${relativeToEditors}/custom-components`;
    }

    if (currentModuleDir.includes("node_modules")) {
      customDir = "../../../editors/custom-components";
    }

    return `${customDir}/${customConfig.path}`;
  }, [customConfig?.path]);
}

export function useCustomComponent(
  customConfig: CustomComponentConfig | undefined
): {
  CustomComponent: ComponentType<CustomComponentProps> | null;
  isLoadingCustomComponent: boolean;
  errorLoadingCustomComponent: string | null;
} {
  const [customComponent, setCustomComponent] =
    useState<ComponentType<CustomComponentProps> | null>(null);
  const [isLoadingCustomComponent, setIsLoadingCustomComponent] =
    useState<boolean>(false);
  const [errorLoadingCustomComponent, setErrorLoadingCustomComponent] =
    useState<string | null>(null);

  const customPath = useCustomPath(customConfig);

  useEffect(() => {
    setCustomComponent(null);
    setErrorLoadingCustomComponent(null);

    if (!customConfig?.path) {
      setIsLoadingCustomComponent(false);
      setErrorLoadingCustomComponent("Custom component path not provided");
      return;
    }

    if (!customPath) {
      setIsLoadingCustomComponent(false);
      setErrorLoadingCustomComponent("Error resolving custom component path");
      return;
    }

    let cancelled = false;
    const loadCustomComponent = async () => {
      setIsLoadingCustomComponent(true);
      try {
        const importedModule: unknown = await import(
          /* @vite-ignore */ customPath
        );
        let componentCandidate: unknown = null;

        if (
          importedModule &&
          typeof importedModule === "object" &&
          importedModule !== null
        ) {
          const moduleRecord = importedModule as Record<string, unknown>;
          componentCandidate =
            moduleRecord.default ??
            moduleRecord.CustomComponent ??
            moduleRecord.Component ??
            null;
        }

        if (typeof componentCandidate !== "function") {
          throw new Error(
            `Custom component module at path "${customConfig.path}" does not export a component`
          );
        }

        if (!cancelled) {
          setCustomComponent(
            () => componentCandidate as ComponentType<CustomComponentProps>
          );
        }
      } catch (error: unknown) {
        console.error("Error loading custom component:", error);
        if (!cancelled) {
          setErrorLoadingCustomComponent("Error loading custom component");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingCustomComponent(false);
        }
      }
    };

    void loadCustomComponent();

    return () => {
      cancelled = true;
    };
  }, [customConfig?.path, customPath]);

  return {
    CustomComponent: customComponent,
    isLoadingCustomComponent,
    errorLoadingCustomComponent,
  };
}
