import { cn } from "../../lib/utils.js";
import type { ParsedInputField } from "../../utils/parser-utils.js";
import { getTypeColor } from "../../utils/parser-utils.js";
import { ChevronDown } from "lucide-react";

interface SchemaInputProps {
  input: ParsedInputField;
  light?: boolean;
}

export function SchemaInput({ input, light }: SchemaInputProps) {
  const isEnum = input.type === "Enum";
  const displayType = isEnum && input.enumName ? input.enumName : input.type;

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-2 pl-4 bg-gray-100 border border-gray-200 rounded-full",
        !light ? "bg-gray-100" : "bg-white"
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-black text-sm truncate" title={input.name}>
            {input.name}
          </span>
          {!input.optional ? (
            <span className="text-xs text-[#FF4444]">Required</span>
          ) : (
            <span className="text-xs text-[#878787]">Optional</span>
          )}
        </div>
        {/* <div className="flex items-center gap-2 flex-wrap">
          {input.isArray && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-purple-50 text-purple-700 rounded border border-purple-200">
              <List className="w-3 h-3" />
              Array
              {input.arrayDepth && input.arrayDepth > 1 && (
                <span className="font-semibold">x{input.arrayDepth}</span>
              )}
            </span>
          )}
          {input.isArray &&
            input.arrayItemRequired !== undefined &&
            (input.arrayItemRequired ? (
              <span className="px-1 text-[10px] font-medium bg-red-100 text-red-700 rounded">
                Required
              </span>
            ) : (
              <span className="px-1 text-[10px] font-medium bg-gray-100 text-gray-600 rounded">
                Optional
              </span>
            ))}
        </div> */}
      </div>
      <span
        className={cn(
          "px-2 py-0.5 text-xs font-mono rounded-full inline-flex items-center gap-1",
          getTypeColor(input.type)
        )}
      >
        {isEnum && <ChevronDown className="w-3 h-3" />}
        {displayType}
        {input.isArray
          ? new Array(input.arrayDepth)
              .fill(0)
              .map((_) => "[]")
              .join("")
          : ""}
      </span>
    </div>
  );
}
