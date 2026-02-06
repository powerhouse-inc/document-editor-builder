"use client";

import {
  useState,
  useEffect,
  forwardRef,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactNode,
} from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "../../lib/utils.js";

function Accordion({
  ...props
}: ComponentProps<typeof AccordionPrimitive.Root>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render on client side to avoid hydration issues with Radix UI
  if (!mounted || typeof window === "undefined") {
    // Return a placeholder div to maintain layout
    return <div data-slot="accordion" className={props.className}></div>;
  }

  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

const AccordionItem = forwardRef<
  ElementRef<typeof AccordionPrimitive.Item>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & {
    size?: "sm" | "md" | "lg";
  }
>(function AccordionItem({ className, size = "md", ...props }, ref) {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      data-slot="accordion-item"
      className={cn(
        "rounded-lg border border-gray-200 bg-white text-primary-blue not-last:mb-3",
        size === "sm" ? "p-2" : "p-4",
        className
      )}
      {...props}
    />
  );
});

type AccordionTriggerProps = ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Trigger
> & {
  icon?: ReactNode;
  title?: ReactNode;
  rightSection?: ReactNode;
  hideChevron?: boolean;
};

const AccordionTrigger = forwardRef<
  ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(function AccordionTrigger(
  {
    className,
    children,
    icon,
    title,
    rightSection,
    hideChevron = false,
    ...props
  },
  ref
) {
  const content = title ?? children;
  const showChevron = !hideChevron && !props.disabled;

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between rounded-md text-left text-xs font-semibold transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg]:rotate-180 [&[data-state=open]>svg]:rotate-0 text-primary-blue",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between gap-4 flex-1">
          <span className="flex flex-1 items-center gap-1">
            {icon ? icon : null}
            <span>{content}</span>
          </span>
          {rightSection}
        </div>

        {showChevron && (
          <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200" />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});

function AccordionContent({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-4 pb-0", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
