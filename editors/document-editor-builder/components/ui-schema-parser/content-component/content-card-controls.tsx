import type { JSX } from "react";

interface ContentCardControlProps {
  value: JSX.Element | string | number | boolean;
  label?: string;
}

export const ContentCardTitleControl = ({
  value,
  label,
}: ContentCardControlProps) => {
  return (
    <div className="flex flex-col gap-2">
      {!!label && <span className="text-sm text-(--secondary)">{label}</span>}
      <span className="text-3xl font-bold text-(--foreground) whitespace-pre-wrap">
        {value}
      </span>
    </div>
  );
};

export const ContentCardSubtitleControl = ({
  value,
  label,
}: ContentCardControlProps) => {
  return (
    <div className="flex flex-col gap-2">
      {!!label && <span className="text-sm text-(--secondary)">{label}</span>}
      <span className="text-lg text-(--foreground) whitespace-pre-wrap">
        {value}
      </span>
    </div>
  );
};

export const ContentCardLabelControl = ({
  value,
  label,
}: ContentCardControlProps) => {
  return (
    <div className="flex flex-col gap-2">
      {!!label && <span className="text-sm text-(--secondary)">{label}</span>}
      <span className="text-sm text-(--foreground) whitespace-pre-wrap">
        {value}
      </span>
    </div>
  );
};

export const ContentCardParagraphControl = ({
  value,
  label,
}: ContentCardControlProps) => {
  return (
    <div className="flex flex-col gap-2">
      {!!label && <span className="text-sm text-(--secondary)">{label}</span>}
      <span className="text-xs text-(--foreground) whitespace-pre-wrap">
        {value}
      </span>
    </div>
  );
};

export const ContentCardBulletListControl = ({
  value,
  label,
}: {
  value: (string | object)[];
  label?: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      {!!label && <span className="text-sm text-(--secondary)">{label}</span>}
      <ul className="list-disc list-inside">
        {value.map((item) => {
          const isObject = typeof item === "object";
          const value = isObject ? JSON.stringify(item) : item;
          return (
            <li key={value}>
              <span className="text-xs text-(--foreground)">{value}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
