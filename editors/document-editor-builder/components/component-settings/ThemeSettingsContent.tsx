import { useSelectedDocumentEditorBuilderDocument } from "../../hooks/useDocumentEditorBuilderDocument.js";

import { ColorPicker } from "../ui/color-picker.js";
import { ComponentSettingsHeader } from "./ComponentSettingsHeader.js";
import {
  actions,
  type Theme,
  type GroupComponentConfig,
} from "../../../../document-models/document-editor-builder/index.js";
import GroupPropsSection from "./GroupPropsSection.js";
import { Separator } from "../ui/separator.js";

export function ThemeSettingsContent({ onClose }: { onClose: () => void }) {
  const [documentEditor, dispatch] = useSelectedDocumentEditorBuilderDocument();

  return (
    <div className="flex flex-col w-full min-w-[315px] gap-4">
      <ComponentSettingsHeader hideOptions title="Theme" onClose={onClose} />

      <div className="flex-1 overflow-auto px-4 pb-4 space-y-4">
        {/* Theme Colors */}
        <div className="flex flex-col gap-4">
          <div className="text-sm font-semibold">Colors</div>
          {[
            {
              key: "primaryColor",
              label: "Primary Color",
              defaultColor: "#000000",
            },
            {
              key: "backgroundColor",
              label: "Background Color",
              defaultColor: "#FFFFFF00",
            },
            {
              key: "textColor",
              label: "Text Color",
              defaultColor: "#111827",
            },
            {
              key: "secondaryTextColor",
              label: "Secondary Text Color",
              defaultColor: "#6B7280",
            },
          ].map(({ key, label, defaultColor }) => (
            <div className="flex items-center justify-between gap-4" key={key}>
              <div className="text-sm font-medium">{label}</div>
              <ColorPicker
                value={
                  documentEditor.state.global.theme?.[key as keyof Theme] ??
                  defaultColor
                }
                onBlur={(value) =>
                  dispatch(actions.editTheme({ [key]: value }))
                }
              />
            </div>
          ))}
        </div>

        <Separator className="bg-gray-200" />

        {/* Root Group Props */}
        <div className="flex flex-col">
          <div className="text-sm font-semibold">Root Layout</div>
          <RootGroupPropsSection />
        </div>
      </div>
    </div>
  );
}

function RootGroupPropsSection() {
  const [documentEditor, dispatch] = useSelectedDocumentEditorBuilderDocument();
  const groupProps = documentEditor.state.global.groupProps ?? null;

  const handleUpdate = (updates: Partial<GroupComponentConfig>) => {
    dispatch(actions.editRootGroupProps(updates));
  };
  return (
    <GroupPropsSectionForRoot groupProps={groupProps} onUpdate={handleUpdate} />
  );
}

function GroupPropsSectionForRoot({
  groupProps,
  onUpdate,
}: {
  groupProps: GroupComponentConfig | null;
  onUpdate: (updates: Partial<GroupComponentConfig>) => void;
}) {
  const mockComponent = {
    id: "root",
    type: "group" as const,
    control: "group" as const,
    config: groupProps,
    groupId: null,
  };

  return (
    <div className="flex-1 space-y-4">
      <div className="text-xs text-gray-500">
        Configure the root layout properties for the entire document.
      </div>
      <GroupPropsSection component={mockComponent} onUpdate={onUpdate} />
    </div>
  );
}

export default ThemeSettingsContent;
