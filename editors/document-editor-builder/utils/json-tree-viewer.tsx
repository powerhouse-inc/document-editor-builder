import { useState } from "react";
import { ChevronRight, ChevronDown, Copy, Check } from "lucide-react";
import { Button } from "@powerhousedao/document-engineering";

interface JsonTreeNodeProps {
  data: unknown;
  keyName?: string;
  level?: number;
}

interface JsonTreeViewerProps {
  data: unknown;
}

function JsonTreeNode({ data, keyName, level = 0 }: JsonTreeNodeProps) {
  const canExpand = (value: unknown): boolean => {
    return (
      (typeof value === "object" && value !== null) || Array.isArray(value)
    );
  };

  const [isExpanded, setIsExpanded] = useState(canExpand(data)); // Auto-expand all expandable items
  const indent = level * 20;

  const getValueType = (value: unknown): string => {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    return typeof value;
  };

  const getValueColor = (type: string): string => {
    switch (type) {
      case "string":
        return "text-green-600 ";
      case "number":
        return "text-blue-600";
      case "boolean":
        return "text-purple-600";
      case "null":
        return "text-gray-500";
      default:
        return "text-gray-800";
    }
  };

  const formatValue = (value: unknown): string => {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (typeof value === "string") return `"${value}"`;
    if (typeof value === "boolean") return value.toString();
    if (typeof value === "number") return value.toString();
    return JSON.stringify(value);
  };

  const renderKey = () => {
    if (keyName === undefined) return null;
    return <span className="text-blue-80 font-medium">"{keyName}":</span>;
  };

  const renderValue = () => {
    const type = getValueType(data);
    const colorClass = getValueColor(type);

    if (canExpand(data)) {
      return (
        <span className="text-gray-600">
          {Array.isArray(data) ? `Array(${data.length})` : "Object"}
        </span>
      );
    }

    return <span className={colorClass}>{formatValue(data)}</span>;
  };

  const renderChildren = () => {
    if (!canExpand(data) || !isExpanded) return null;

    if (Array.isArray(data)) {
      return data.map((item: unknown, index: number) => (
        <JsonTreeNode
          key={index}
          data={item}
          keyName={index.toString()}
          level={level + 1}
        />
      ));
    }

    if (typeof data === "object" && data !== null) {
      return Object.entries(data as Record<string, unknown>).map(
        ([key, value]) => (
          <JsonTreeNode
            key={key}
            data={value}
            keyName={key}
            level={level + 1}
          />
        )
      );
    }

    return null;
  };

  const toggleExpanded = () => {
    if (canExpand(data)) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="select-none">
      <div
        className="flex items-center py-1 hover:bg-gray-5 rounded px-1 cursor-pointer"
        style={{ paddingLeft: `${indent}px` }}
        onClick={toggleExpanded}
      >
        {canExpand(data) && (
          <div className="mr-1 flex items-center">
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 text-gray-500" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-500" />
            )}
          </div>
        )}
        {!canExpand(data) && <div className="w-4 mr-1" />}

        <div className="flex items-center gap-2">
          {renderKey()}
          {renderValue()}
        </div>
      </div>

      {isExpanded && (
        <div className="border-l border-gray-200 ml-2">{renderChildren()}</div>
      )}
    </div>
  );
}

export function JsonTreeViewer({ data }: JsonTreeViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = async () => {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy JSON:", err);
    }
  };

  return (
    <div className="flex flex-1 flex-col w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">Schema JSON</h3>
        <Button size="sm" onClick={handleCopyAll} variant="outline">
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy All
            </>
          )}
        </Button>
      </div>
      <div className="flex-1 overflow-auto w-full">
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <JsonTreeNode data={data} />
        </div>
      </div>
    </div>
  );
}

export default JsonTreeViewer;
