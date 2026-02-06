import {
  Sidebar,
  SidebarProvider,
  type SidebarNode,
} from "@powerhousedao/document-engineering";
import { useEffect, useMemo, useState } from "react";
import type { EditorComponent } from "../../../../document-models/document-editor-builder/index.js";
import { useSelectedDocumentEditorBuilderDocument } from "../../hooks/useDocumentEditorBuilderDocument.js";
import { LayerIcon, LayerName } from "./SortableLayer.js";

interface TreeNode {
  component: EditorComponent;
  children: TreeNode[];
}

export default function SidebarLayersTab() {
  const [documentEditor] = useSelectedDocumentEditorBuilderDocument();

  const schema = useMemo(() => {
    return documentEditor.state.global.schema;
  }, [documentEditor]);

  const sidebarNodes = useMemo(() => {
    const components = schema;
    const rootNodes: TreeNode[] = [];
    const nodeMap = new Map<string, TreeNode>();
    const childNodes = new Set<string>(); // Track nodes that are children

    // First pass: create all nodes
    components.forEach((component) => {
      const node: TreeNode = {
        component,
        children: [],
      };
      nodeMap.set(component.id, node);
    });

    // Second pass: build tree structure
    components.forEach((component) => {
      const node = nodeMap.get(component.id)!;

      if (component.groupId && nodeMap.has(component.groupId)) {
        const parentNode = nodeMap.get(component.groupId)!;
        // Prevent self-reference
        if (component.groupId !== component.id) {
          parentNode.children.push(node);
          childNodes.add(component.id);
        } else {
          // Self-reference, treat as root
          rootNodes.push(node);
        }
      } else {
        // No parent or parent not found, treat as root
        rootNodes.push(node);
      }
    });

    // Remove child nodes from rootNodes (they should only appear under their parent)
    // Maintain the order from the schema by filtering in order
    const filteredRootNodes: TreeNode[] = [];

    // Process components in schema order to preserve order
    components.forEach((component) => {
      const node = nodeMap.get(component.id);
      if (node && !childNodes.has(component.id)) {
        filteredRootNodes.push(node);
      }
    });

    // Convert TreeNode to SidebarNode with cycle detection
    const convertToSidebarNode = (
      node: TreeNode,
      visited = new Set<string>()
    ): SidebarNode => {
      // Prevent cycles in conversion
      if (visited.has(node.component.id)) {
        return {
          id: node.component.id,
          title: LayerName(node.component),
          icon: LayerIcon(node.component) as React.ReactElement,
        };
      }

      visited.add(node.component.id);
      const icon = LayerIcon(node.component);
      const name = LayerName(node.component);

      return {
        id: node.component.id,
        title: name,
        icon: icon as React.ReactElement,
        children:
          node.children.length > 0
            ? node.children.map((child) =>
                convertToSidebarNode(child, new Set(visited))
              )
            : undefined,
      };
    };

    return filteredRootNodes.map((node) => convertToSidebarNode(node));
  }, [schema]);

  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey(key + 1);
  }, [sidebarNodes]);

  return (
    <SidebarProvider nodes={sidebarNodes} key={key}>
      <Sidebar
        showSearchBar={false}
        enableMacros={0}
        resizable={false}
        allowPinning={false}
        className="h-full"
        initialWidth={360}
      />
    </SidebarProvider>
  );
}
