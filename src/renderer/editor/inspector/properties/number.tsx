import { observer } from "mobx-react-lite";

import { cn } from "@/utils";
import { SerializedProperty } from "@atlas/editor/serialized-object";

export const NumberProperty: React.FC<{
  property: SerializedProperty;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: () => void;
}> = observer(({ property, className, disabled, readOnly, onChange }) => {
  return (
    <input
      type="number"
      className={cn("", className)}
      value={property.numberValue}
      disabled={disabled}
      readOnly={readOnly}
      onChange={(e) => {
        property.numberValue = e.currentTarget.valueAsNumber;
        property.serializedObject.applyModifiedProperties();
        onChange?.();
      }}
    />
  );
});
