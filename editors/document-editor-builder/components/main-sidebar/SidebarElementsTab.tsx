import { generateId } from "document-model";
import {
  BaselineIcon,
  CirclePlusIcon,
  Code,
  Group,
  Heading1,
  Heading2,
  Heading3,
  List,
  PilcrowIcon,
  SpaceIcon,
} from "lucide-react";
import {
  actions,
  type EditorComponentControl,
} from "../../../../document-models/document-editor-builder/index.js";
import { useSelectedDocumentEditorBuilderDocument } from "../../hooks/useDocumentEditorBuilderDocument.js";
import { Accordion, AccordionItem, AccordionTrigger } from "../ui/accordion.js";
import { ButtonDiv } from "../ui/button-div.js";
import AddCustomPanel from "./AddCustomPanel.js";

export default function SidebarElementsTab() {
  const [_, dispatch] = useSelectedDocumentEditorBuilderDocument();

  const handleAddForm = () => {
    dispatch(
      actions.addComponent({
        id: generateId(),
        type: "action",
        control: "form",
      })
    );
  };

  const handleAddGroup = () => {
    dispatch(
      actions.addComponent({
        id: generateId(),
        type: "group",
        control: "group",
      })
    );
  };

  const handleAddSpacer = () => {
    dispatch(
      actions.addComponent({
        id: generateId(),
        type: "spacer",
        control: "spacer",
      })
    );
  };

  const handleAddContent = (control: EditorComponentControl) => {
    dispatch(
      actions.addComponent({
        id: generateId(),
        type: "content",
        control: control,
      })
    );
  };

  return (
    <div className="flex flex-col gap gap-3">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="form" size="sm">
          <AccordionTrigger
            hideChevron
            title="Form"
            icon={<BaselineIcon size={16} />}
            rightSection={
              <ButtonDiv
                className=" w-6 h-6"
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
            }
          />
        </AccordionItem>

        <AccordionItem value="title" size="sm">
          <AccordionTrigger
            hideChevron
            title="Title"
            icon={<Heading1 size={16} />}
            rightSection={
              <ButtonDiv
                className=" w-6 h-6"
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleAddContent("title");
                }}
              >
                <CirclePlusIcon size={16} />
              </ButtonDiv>
            }
          />
        </AccordionItem>

        <AccordionItem value="subtitle" size="sm">
          <AccordionTrigger
            hideChevron
            title="Subtitle"
            icon={<Heading2 size={16} />}
            rightSection={
              <ButtonDiv
                className=" w-6 h-6"
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleAddContent("subtitle");
                }}
              >
                <CirclePlusIcon size={16} />
              </ButtonDiv>
            }
          />
        </AccordionItem>

        <AccordionItem value="label" size="sm">
          <AccordionTrigger
            hideChevron
            title="Label"
            icon={<Heading3 size={16} />}
            rightSection={
              <ButtonDiv
                className=" w-6 h-6"
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleAddContent("label");
                }}
              >
                <CirclePlusIcon size={16} />
              </ButtonDiv>
            }
          />
        </AccordionItem>

        <AccordionItem value="paragraph" size="sm">
          <AccordionTrigger
            hideChevron
            title="Paragraph"
            icon={<PilcrowIcon size={16} />}
            rightSection={
              <ButtonDiv
                className=" w-6 h-6"
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleAddContent("paragraph");
                }}
              >
                <CirclePlusIcon size={16} />
              </ButtonDiv>
            }
          />
        </AccordionItem>

        <AccordionItem value="bullet-list" size="sm">
          <AccordionTrigger
            hideChevron
            title="Bullet List"
            icon={<List size={16} />}
            rightSection={
              <ButtonDiv
                className=" w-6 h-6"
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleAddContent("bulletList");
                }}
              >
                <CirclePlusIcon size={16} />
              </ButtonDiv>
            }
          />
        </AccordionItem>

        <AccordionItem value="custom" size="sm">
          <AccordionTrigger
            hideChevron
            title="Custom Component"
            icon={<Code size={16} />}
            rightSection={<AddCustomPanel />}
          />
        </AccordionItem>
        <AccordionItem value="group" size="sm">
          <AccordionTrigger
            hideChevron
            title="Group"
            icon={<Group size={16} />}
            rightSection={
              <ButtonDiv
                className=" w-6 h-6"
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleAddGroup();
                }}
              >
                <CirclePlusIcon size={16} />
              </ButtonDiv>
            }
          />
        </AccordionItem>
        <AccordionItem value="spacer" size="sm">
          <AccordionTrigger
            hideChevron
            title="Spacer"
            icon={<SpaceIcon size={16} />}
            rightSection={
              <ButtonDiv
                className=" w-6 h-6"
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleAddSpacer();
                }}
              >
                <CirclePlusIcon size={16} />
              </ButtonDiv>
            }
          />
        </AccordionItem>
      </Accordion>
    </div>
  );
}
