import { generateId } from "document-model";
import { BaselineIcon, CirclePlusIcon, EyeIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import { actions } from "../../../../document-models/document-editor-builder/index.js";
import { useSelectedDocumentEditorBuilderDocument } from "../../hooks/useDocumentEditorBuilderDocument.js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion.js";
import { ButtonDiv } from "../ui/button-div.js";
import { Separator } from "../ui/separator.js";
import AddActionPanel from "./AddActionPanel.js";
import AddStatePanel from "./AddStatePanel.js";

export default function SidebarWidgetsTab() {
  const [_, dispatch] = useSelectedDocumentEditorBuilderDocument();

  const handleAddForm = useCallback(() => {
    dispatch(
      actions.addComponent({
        id: generateId(),
        type: "action",
        control: "form",
      })
    );
  }, [dispatch]);

  const handleAddState = useCallback(() => {
    dispatch(
      actions.addComponent({
        id: generateId(),
        type: "content",
        control: "label",
        scope: "",
      })
    );
  }, [dispatch]);

  const formRightSection = useMemo(
    () => (
      <ButtonDiv
        size="icon"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleAddForm();
        }}
      >
        <CirclePlusIcon size={16} />
      </ButtonDiv>
    ),
    [handleAddForm]
  );

  const stateRightSection = useMemo(
    () => (
      <ButtonDiv
        size="icon"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleAddState();
        }}
      >
        <CirclePlusIcon size={16} />
      </ButtonDiv>
    ),
    [handleAddState]
  );

  return (
    <div className="flex flex-col gap gap-3">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="form">
          <AccordionTrigger
            title="Action"
            icon={<BaselineIcon size={16} />}
            rightSection={formRightSection}
          />
          <AccordionContent>
            <div className="flex flex-col gap-4">
              <Separator />
              <AddActionPanel />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="state">
          <AccordionTrigger
            title="State"
            icon={<EyeIcon size={16} />}
            rightSection={stateRightSection}
          />
          <AccordionContent>
            <div className="flex flex-col gap-4">
              <Separator />
              <AddStatePanel />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
