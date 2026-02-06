import { getConfig } from "@powerhousedao/config/node";
import type { InternalTransmitterUpdate, IProcessor } from "document-drive";
import fs from "fs";
import type {
  CustomComponentConfig,
  DocumentEditorBuilderGlobalState,
  EditCustomComponentAction,
  AddComponentAction,
  EditorComponent,
} from "../../document-models/document-editor-builder/index.js";
import { generateBlankCustomComponentTemplate } from "./utils.js";

export class DocumentEditorBuilderCustomComponentProcessor
  implements IProcessor
{
  async onStrands(strands: InternalTransmitterUpdate[]): Promise<void> {
    const state = strands?.at(-1)?.state as DocumentEditorBuilderGlobalState;
    if (!state) {
      return;
    }

    const lastOperation = strands?.at(-1)?.operations.at(-1);
    const lastOperationType = lastOperation?.action?.type || "";
    const validOperations = ["EDIT_CUSTOM_COMPONENT", "ADD_COMPONENT"];
    if (!validOperations.includes(lastOperationType)) {
      return;
    }
    if (
      lastOperationType === "EDIT_CUSTOM_COMPONENT" &&
      !(lastOperation?.action as EditCustomComponentAction)?.input?.path
    ) {
      return;
    }
    if (
      lastOperationType === "ADD_COMPONENT" &&
      (lastOperation?.action as AddComponentAction)?.input?.type !== "custom"
    ) {
      return;
    }

    const config = getConfig();
    const customComponent = state?.schema.find(
      (component: EditorComponent) =>
        component.id ===
        (lastOperation?.action as EditCustomComponentAction)?.input?.id
    );
    if (!customComponent) {
      return;
    }

    const customConfig = customComponent.config as CustomComponentConfig;
    const customDir = `${config.editorsDir}/custom-components`;
    const customPath = `${customDir}/${customConfig.path}`;
    fs.mkdirSync(customDir, { recursive: true });

    // Check if component existed before generation
    const existedBefore = fs.existsSync(customPath);
    if (!existedBefore) {
      console.log("Generating custom component", customComponent);
      const template = generateBlankCustomComponentTemplate(
        customConfig.name || "Custom Component"
      );
      fs.writeFileSync(customPath, template, "utf8");
    }
  }

  async onDisconnect() {}
}
