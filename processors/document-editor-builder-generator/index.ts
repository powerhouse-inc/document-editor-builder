import { generateEditor, generateManifest } from "@powerhousedao/codegen";
import { getConfig } from "@powerhousedao/config/node";
import { kebabCase } from "change-case";
import {
  logger,
  type InternalTransmitterUpdate,
  type IProcessor,
} from "document-drive";
import fs from "fs";
import type { DocumentEditorBuilderGlobalState } from "../../document-models/document-editor-builder/index.js";
import { generateTemplate } from "./utils.js";

export class DocumentEditorBuilderGeneratorProcessor implements IProcessor {
  async onStrands(strands: InternalTransmitterUpdate[]): Promise<void> {
    const state = strands?.at(-1)?.state as DocumentEditorBuilderGlobalState;
    if (!state || !state.documentType || !state.documentName) {
      return;
    }

    const config = getConfig();
    const editorDir = `${config.editorsDir}/${kebabCase(state.documentName)}`;
    const editorPath = `${editorDir}/editor.tsx`;

    // Check if editor existed before generation
    const existedBefore = fs.existsSync(editorPath);

    // If this is the first time generating the editor, replace the new file
    if (!existedBefore) {
      await generateCustomEditor(state.documentName, [state.documentType]);
      await new Promise(resolve => setTimeout(resolve, 500));
      const template = generateTemplate(state.documentType);
      fs.writeFileSync(editorPath, template, "utf8");
    }

    console.log("🔄 Writing schema to file", `${editorDir}/schema.json`);

    try {
      fs.writeFileSync(
        `${editorDir}/schema.json`,
        JSON.stringify(
          {
            schema: state.schema,
            theme: state.theme,
            groupProps: state.groupProps,
          },
          null,
          2
        )
      );
    } catch (error) {
      console.error("Error writing schema to file", error);
    }
  }

  async onDisconnect() {}
}

async function generateCustomEditor(
  documentName: string,
  documentTypes: string[]
): Promise<void> {
  logger.info(`🔄 Starting Custom editor generation for: ${documentName}`);
  try {
    // Generate editor ID using kebabCase
    const editorId: string = kebabCase(documentName);

    const WORKING_DIR = process.cwd();
    const config = getConfig();
    // Generate the editor using the codegen function
    await generateEditor({
      name: documentName,
      documentTypes,
      config,
      useTsMorph: true,
      editorId,
    });

    logger.info(
      `✅ Custom Editor generation completed successfully for: ${documentName}`
    );

    // Update the manifest with the new editor
    try {
      logger.info(
        `🔄 Updating manifest with editor: ${documentName} (ID: ${editorId})`
      );

      generateManifest(
        {
          editors: [
            {
              id: editorId,
              name: documentName,
              documentTypes: documentTypes,
            },
          ],
        },
        WORKING_DIR
      );

      logger.info(
        `✅ Manifest updated successfully for editor: ${documentName}`
      );
    } catch (manifestError) {
      logger.error(
        `⚠️ Failed to update manifest for editor ${documentName}:`,
        manifestError
      );
      // Don't throw here - editor generation was successful
    }

    // Backup the document
    // try {

    // const generatedDocument = await reactor.get(documentName);

    // const BACKUP_FOLDER = "backup-documents";
    // const backupPath = join(WORKING_DIR, BACKUP_FOLDER);
    // await mkdir(backupPath, { recursive: true });

    // const filePath = await baseSaveToFile(
    //   generatedDocument,
    //   backupPath,
    //   undefined,
    //   documentName
    // );

    // logger.debug(`📁 Document backed up to: ${filePath}`);
    // return filePath;
    // } catch (error) {
    //   logger.warn(`⚠️ Failed to backup document "${docName}":`, error);
    //   return undefined;
    // }
  } catch (error) {
    logger.error(
      `❌ Error during custom editor generation for ${documentName}:`,
      error
    );
    if (error instanceof Error) {
      logger.error(`❌ Error message: ${error.message}`);
    }
    // Don't throw - let codegen continue with other documents
    return;
  }
}
