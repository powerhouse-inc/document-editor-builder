import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "../../lib/utils.js";

type TabsVariant = "pills" | "underline";

const TabsVariantContext = React.createContext<{ variant: TabsVariant }>({
  variant: "pills",
});

function useTabsVariant() {
  return React.useContext(TabsVariantContext);
}

type TabsProps = React.ComponentProps<typeof TabsPrimitive.Root> & {
  variant?: TabsVariant;
};

function Tabs({ className, variant = "pills", ...props }: TabsProps) {
  return (
    <TabsVariantContext.Provider value={{ variant }}>
      <TabsPrimitive.Root
        data-slot="tabs"
        data-variant={variant}
        className={cn("flex flex-col", className)}
        {...props}
      />
    </TabsVariantContext.Provider>
  );
}

type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List>;

function TabsList({ className, ...props }: TabsListProps) {
  const { variant } = useTabsVariant();

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(
        "text-muted-foreground inline-flex h-[36px] w-fit items-center justify-center rounded-lg gap-2",
        variant === "underline" && "rounded-none h-auto gap-6 -mb-[1px]",
        className
      )}
      {...props}
    />
  );
}

type TabsTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger>;

function TabsTrigger({ className, ...props }: TabsTriggerProps) {
  const { variant } = useTabsVariant();

  const baseClasses =
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring inline-flex h-full flex-1 items-center justify-center gap-1.5 border px-4 text-sm font-medium whitespace-nowrap rounded-md text-black dark:text-foreground focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

  const variantClasses =
    variant === "underline"
      ? "rounded-none border-b-[1.5px] border-l-0 border-r-0 border-t-0 border-transparent bg-transparent px-4 py-2 text-[#878787] data-[state=active]:border-black data-[state=active]:text-black data-[state=active]:bg-transparent focus-visible:border-b-black focus-visible:outline-0 focus-visible:ring-0"
      : "border border-transparent data-[state=active]:bg-primary-blue data-[state=active]:text-white dark:data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30";

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      data-variant={variant}
      className={cn(baseClasses, variantClasses, className)}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("pt-3 h-full flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
