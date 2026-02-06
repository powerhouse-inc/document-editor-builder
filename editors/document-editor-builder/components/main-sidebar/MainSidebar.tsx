import { FileBracesCorner, Layers, LayoutGrid } from "lucide-react";
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs.js";
import SidebarLayersTab from "./SidebarLayersTab.js";
import SidebarWidgetsTab from "./SidebarWidgetsTab.js";
import SidebarElementsTab from "./SidebarElementsTab.js";

export function MainSidebar() {
  const [activeTab, setActiveTab] = useState<
    "document" | "elements" | "layers"
  >("document");

  return (
    <aside className="flex flex-col gap-3 w-full md:w-[360px] sticky top-0 h-full ">
      <Tabs
        value={activeTab}
        onValueChange={(value: string) =>
          setActiveTab(value as "document" | "elements" | "layers")
        }
        className="h-full overflow-auto"
      >
        <TabsList>
          <TabsTrigger value="document">
            <div className="flex items-center gap-1">
              <FileBracesCorner className="w-4 h-4" />
              <span className="text-sm font-medium">Document</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="elements">
            <div className="flex items-center gap-1">
              <LayoutGrid className="w-4 h-4" />
              <span className="text-sm font-medium">Elements</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="layers">
            <div className="flex items-center gap-1">
              <Layers className="w-4 h-4" />
              <span className="text-sm font-medium">Layers</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 h-full overflow-auto">
          <TabsContent value="document">
            <SidebarWidgetsTab />
          </TabsContent>
          <TabsContent value="elements">
            <SidebarElementsTab />
          </TabsContent>
          <TabsContent value="layers">
            <SidebarLayersTab />
          </TabsContent>
        </div>
      </Tabs>
    </aside>
  );
}

export default MainSidebar;
