import { Button, TextInput } from "@powerhousedao/document-engineering";
import { generateId } from "document-model";
import { CirclePlusIcon } from "lucide-react";
import { useState } from "react";
import { actions } from "../../../../document-models/document-editor-builder/index.js";
import { useSelectedDocumentEditorBuilderDocument } from "../../hooks/useDocumentEditorBuilderDocument.js";
import { ButtonDiv } from "../ui/button-div.js";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog.js";

export default function AddCustomPanel() {
  const [_, dispatch] = useSelectedDocumentEditorBuilderDocument();

  const [customName, setCustomName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddCustom = () => {
    dispatch(
      actions.addComponent({
        id: generateId(),
        type: "custom",
        control: "custom",
        name: customName,
      })
    );
    setDialogOpen(false);
    setCustomName("");
  };

  return (
    <>
      <ButtonDiv
        className=" w-6 h-6"
        size="icon"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setDialogOpen(true);
        }}
      >
        <CirclePlusIcon size={16} />
      </ButtonDiv>

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
