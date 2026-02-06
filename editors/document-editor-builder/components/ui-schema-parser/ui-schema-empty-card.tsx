import { Button, TextInput } from "@powerhousedao/document-engineering";
import { generateId } from "document-model";
import {
  BaselineIcon,
  CirclePlusIcon,
  Code,
  EyeIcon,
  GroupIcon,
  Heading1,
  Heading2,
  Heading3,
  ListIcon,
  PilcrowIcon,
  SpaceIcon,
} from "lucide-react";
import { useState } from "react";
import { actions } from "../../../../document-models/document-editor-builder/index.js";
import { useSelectedDocumentEditorBuilderDocument } from "../../hooks/useDocumentEditorBuilderDocument.js";
import { cn } from "../../lib/utils.js";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.js";

export default function UiSchemaEmptyCard({
  size = "md",
  noActionOption,
  groupId,
}: {
  size?: "md" | "sm";
  noActionOption?: boolean;
  groupId?: string;
}) {
  const [_, dispatch] = useSelectedDocumentEditorBuilderDocument();
  const [menuOpen, setMenuOpen] = useState(false);

  const [customName, setCustomName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddCustom = () => {
    dispatch(
      actions.addComponent({
        id: generateId(),
        type: "custom",
        control: "custom",
        name: customName,
        groupId,
      })
    );
    setDialogOpen(false);
    setCustomName("");
  };

  const options = [
    !noActionOption && {
      icon: <BaselineIcon className="text-primary-blue" />,
      content: "Form",
      onClick: () => {
        dispatch(
          actions.addComponent({
            id: generateId(),
            type: "action",
            control: "form",
            groupId,
          })
        );
      },
    },
    {
      icon: <EyeIcon className="text-primary-blue" />,
      content: "State Text",
      onClick: () => {
        dispatch(
          actions.addComponent({
            id: generateId(),
            type: "content",
            control: "label",
            scope: "",
            groupId,
          })
        );
      },
    },
    {
      icon: <Heading1 className="text-primary-blue" />,
      content: "Title",
      onClick: () => {
        dispatch(
          actions.addComponent({
            id: generateId(),
            type: "content",
            control: "title",
            groupId,
          })
        );
      },
    },
    {
      icon: <Heading2 className="text-primary-blue" />,
      content: "Subtitle",
      onClick: () => {
        dispatch(
          actions.addComponent({
            id: generateId(),
            type: "content",
            control: "subtitle",
            groupId,
          })
        );
      },
    },

    {
      icon: <Heading3 className="text-primary-blue" />,
      content: "Label",
      onClick: () => {
        dispatch(
          actions.addComponent({
            id: generateId(),
            type: "content",
            control: "label",
            groupId,
          })
        );
      },
    },
    {
      icon: <PilcrowIcon className="text-primary-blue" />,
      content: "Paragraph",
      onClick: () => {
        dispatch(
          actions.addComponent({
            id: generateId(),
            type: "content",
            control: "paragraph",
            groupId,
          })
        );
      },
    },
    {
      icon: <ListIcon className="text-primary-blue" />,
      content: "Bullet List",
      onClick: () => {
        dispatch(
          actions.addComponent({
            id: generateId(),
            type: "content",
            control: "bulletList",
            groupId,
          })
        );
      },
    },
    {
      icon: <Code className="text-primary-blue" />,
      content: "Custom Component",
      onClick: () => {
        setDialogOpen(true);
      },
    },
    {
      icon: <GroupIcon className="text-primary-blue" />,
      content: "Group",
      onClick: () => {
        dispatch(
          actions.addComponent({
            id: generateId(),
            type: "group",
            control: "group",
            groupId,
          })
        );
      },
    },
    {
      icon: <SpaceIcon className="text-primary-blue" />,
      content: "Spacer",
      onClick: () => {
        dispatch(
          actions.addComponent({
            id: generateId(),
            type: "spacer",
            control: "spacer",
            groupId,
          })
        );
      },
    },
  ].filter((c) => !!c);

  return (
    <>
      <DropdownMenu onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger className={cn({ "h-full w-full": size === "sm" })}>
          <div
            className={cn(
              "relative flex items-center justify-center h-full w-full bg-gray-100 opacity-50 hover:opacity-100 transition-all duration-300 cursor-pointer rounded-md",
              menuOpen ? "opacity-100" : "",
              size === "sm"
                ? "min-h-[40px] min-w-[40px]"
                : "min-h-[90px] min-w-[90px] max-h-[90px]"
            )}
          >
            <CirclePlusIcon className="w-6 h-6 rounded-full text-gray-400 stroke-1" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {options.map((option) => (
            <DropdownMenuItem key={option.content} onClick={option.onClick}>
              <span className="flex flex-1 items-center gap-1 text-primary-blue">
                {option.icon ? option.icon : null}
                <span>{option.content}</span>
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogOpen && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          className="absolute"
        >
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:min-w-[320px]">
              <DialogHeader>
                <DialogTitle>Name New Component</DialogTitle>
              </DialogHeader>

              <TextInput
                autoFocus
                label="Component Name"
                name="custom-component-name"
                value={customName}
                onChange={(event) => setCustomName(event.target.value)}
                placeholder="Enter component name"
              />

              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddCustom} disabled={!customName.trim()}>
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
}
