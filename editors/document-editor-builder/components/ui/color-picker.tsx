"use client";

import type {} from "@powerhousedao/design-system";
import { Button, TextInput } from "@powerhousedao/document-engineering";
import { useMemo, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { cn } from "../../lib/utils.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";

interface ColorPickerProps
  extends Omit<
    React.ComponentProps<"button">,
    "value" | "onChange" | "onBlur"
  > {
  value: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
}

const ColorPicker = ({
  disabled,
  value,
  onChange,
  onBlur,
  name,
  className,
  ...props
}: ColorPickerProps) => {
  const [tempValue, setTempValue] = useState(value);
  const [open, setOpen] = useState(false);

  const parsedValue = useMemo(() => {
    return tempValue || "#FFFFFF";
  }, [tempValue]);

  return (
    <Popover
      onOpenChange={(e) => {
        setOpen(e);
        if (!e) {
          onBlur?.(parsedValue);
        }
      }}
      open={open}
    >
      <PopoverTrigger
        asChild
        disabled={disabled}
        onBlur={() => onBlur?.(parsedValue)}
      >
        <Button
          {...props}
          className={cn("block", className)}
          name={name}
          onClick={() => {
            setOpen(true);
          }}
          size={"icon"}
          style={{
            backgroundColor: parsedValue,
            borderColor: "#ddd",
          }}
          variant="outline"
        >
          <div />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-full shadow-md border-gray-200">
        <div className="flex flex-col gap-1">
          <HexColorPicker
            color={parsedValue}
            onChange={(e) => setTempValue(e)}
          />
          <TextInput
            onChange={(e) => {
              setTempValue(e?.currentTarget?.value);
            }}
            value={parsedValue}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { ColorPicker };
