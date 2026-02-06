import { baseActions } from "document-model";
import {
  documentTypeActions,
  componentsActions,
  schemaActions,
  themeActions,
} from "./gen/creators.js";

/** Actions for the DocumentEditorBuilder document model */

export const actions = {
  ...baseActions,
  ...documentTypeActions,
  ...componentsActions,
  ...schemaActions,
  ...themeActions,
};
