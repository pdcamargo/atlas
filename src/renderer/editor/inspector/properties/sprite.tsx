import { observer } from "mobx-react-lite";

import { cn } from "@/utils";
import { SerializedProperty } from "@atlas/editor/serialized-object";

export const SpriteProperty: React.FC<{
  property: SerializedProperty;
  className?: string;
  disabled?: boolean;
  onChange?: () => void;
}> = observer(({ property, className, disabled, onChange }) => {
  return (
    <input
      type="string"
      className={cn("", className)}
      value={property.findProperty("label").stringValue}
      disabled={disabled}
      readOnly
      onChange={(e) => {
        property.stringValue = e.currentTarget.value;
        property.serializedObject.applyModifiedProperties();
        onChange?.();
      }}
    />
  );
});
