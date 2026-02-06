import type * as React from "react";
import { cn } from "../../lib/utils.js";
import type { HTMLAttributes, ReactNode } from "react";

interface ButtonDivProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  disabled?: boolean;
  variant?: "ghost" | "default" | "outline";
  size?: "icon" | "sm" | "md" | "lg";
}

export function ButtonDiv({
  children,
  variant = "ghost",
  size = "md",
  className,
  disabled,
  ...props
}: ButtonDivProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variantStyles = {
    ghost: "hover:bg-accent hover:text-accent-foreground",
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  };

  const sizeStyles = {
    icon: "h-6 w-6 p-0",
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8",
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          if (props.onClick) {
            props.onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
          }
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
}
