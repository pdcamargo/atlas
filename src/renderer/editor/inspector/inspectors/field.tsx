import { cn } from "@/utils";

export const Field: React.FC<{
  label?: string;
  showLabel?: boolean;
  children: React.ReactNode;
  className?: string;
  labelSize?: number;
}> = ({ label, showLabel = true, labelSize, className, children }) => {
  return (
    <div className={cn("mb-1 last:mb-0 mt-1 last:mt-0", className)}>
      {label && showLabel && (
        <label className="flex items-center gap-2">
          <span
            className="text-xs font-semibold"
            style={{
              width: labelSize ? `${labelSize}ch` : "auto",
              minWidth: labelSize ? `${labelSize}ch` : "auto",
              maxWidth: labelSize ? `${labelSize}ch` : "auto",
            }}
          >
            {label}
          </span>

          <div className="flex-1">{children}</div>
        </label>
      )}
      {(!label || !showLabel) && <div>{children}</div>}
    </div>
  );
};
