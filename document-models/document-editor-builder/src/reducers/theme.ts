import type { DocumentEditorBuilderThemeOperations } from "@powerhousedao/document-editor-builder/document-models/document-editor-builder";

export const documentEditorBuilderThemeOperations: DocumentEditorBuilderThemeOperations =
  {
    editThemeOperation(state, action) {
      if (!state.theme) {
        state.theme = {
          primaryColor: null,
          backgroundColor: null,
          textColor: null,
          secondaryTextColor: null,
        };
      }

      if (action.input.primaryColor !== undefined) {
        state.theme.primaryColor = action.input.primaryColor ?? null;
      }
      if (action.input.backgroundColor !== undefined) {
        state.theme.backgroundColor = action.input.backgroundColor ?? null;
      }
      if (action.input.textColor !== undefined) {
        state.theme.textColor = action.input.textColor ?? null;
      }
      if (action.input.secondaryTextColor !== undefined) {
        state.theme.secondaryTextColor =
          action.input.secondaryTextColor ?? null;
      }
    },
    editRootGroupPropsOperation(state, action) {
      if (!state.groupProps) {
        state.groupProps = {
          layout: "column",
          gap: 0,
          paddingTop: 0,
          paddingRight: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          minWidth: null,
          maxWidth: null,
          minHeight: null,
          maxHeight: null,
          horizontalOrientation: null,
          verticalOrientation: null,
        };
      }
      if (action.input.layout !== undefined) {
        state.groupProps.layout = action.input.layout ?? "column";
      }
      if (action.input.gap !== undefined) {
        state.groupProps.gap = action.input.gap ?? 0;
      }
      if (action.input.paddingTop !== undefined) {
        state.groupProps.paddingTop = action.input.paddingTop ?? 0;
      }
      if (action.input.paddingRight !== undefined) {
        state.groupProps.paddingRight = action.input.paddingRight ?? 0;
      }
      if (action.input.paddingBottom !== undefined) {
        state.groupProps.paddingBottom = action.input.paddingBottom ?? 0;
      }
      if (action.input.paddingLeft !== undefined) {
        state.groupProps.paddingLeft = action.input.paddingLeft ?? 0;
      }
      if (action.input.minWidth !== undefined) {
        state.groupProps.minWidth = action.input.minWidth ?? null;
      }
      if (action.input.maxWidth !== undefined) {
        state.groupProps.maxWidth = action.input.maxWidth ?? null;
      }
      if (action.input.minHeight !== undefined) {
        state.groupProps.minHeight = action.input.minHeight ?? null;
      }
      if (action.input.maxHeight !== undefined) {
        state.groupProps.maxHeight = action.input.maxHeight ?? null;
      }
      if (action.input.horizontalOrientation !== undefined) {
        state.groupProps.horizontalOrientation =
          action.input.horizontalOrientation ?? null;
      }
      if (action.input.verticalOrientation !== undefined) {
        state.groupProps.verticalOrientation =
          action.input.verticalOrientation ?? null;
      }
    },
  };
