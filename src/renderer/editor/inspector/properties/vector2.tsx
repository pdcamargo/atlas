import { observer } from "mobx-react-lite";

import { cn } from "@/utils";
import { SerializedProperty } from "@atlas/editor/serialized-object";
import { NumberProperty } from ".";

export const Vector2Property: React.FC<{
  property: SerializedProperty;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: () => void;
}> = observer(({ property, className, disabled, readOnly, onChange }) => {
  const x = property.findProperty("x");
  const y = property.findProperty("y");

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <label className="flex items-center gap-1">
        x
        <NumberProperty
          property={x}
          disabled={disabled}
          readOnly={readOnly}
          onChange={onChange}
        />
      </label>
      <label className="flex items-center gap-1">
        y
        <NumberProperty
          property={y}
          disabled={disabled}
          readOnly={readOnly}
          onChange={onChange}
        />
      </label>
    </div>
  );
});
