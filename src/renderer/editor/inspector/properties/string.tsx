import { observer } from "mobx-react-lite";

import { cn } from "@/utils";
import { SerializedProperty } from "@atlas/editor/serialized-object";

export const StringProperty: React.FC<{
  property: SerializedProperty;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: () => void;
}> = observer(({ property, className, disabled, readOnly, onChange }) => {
  return (
    <input
      type="string"
      className={cn("", className)}
      value={property.stringValue}
      disabled={disabled}
      readOnly={readOnly}
      onChange={(e) => {
        property.stringValue = e.currentTarget.value;
        property.serializedObject.applyModifiedProperties();
        onChange?.();
      }}
    />
  );
});
