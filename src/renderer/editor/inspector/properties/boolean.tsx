import { observer } from "mobx-react-lite";

import { cn } from "@/utils";
import { SerializedProperty } from "@atlas/editor/serialized-object";
import { Checkbox } from "@/components/ui/checkbox";

export const BooleanProperty: React.FC<{
  property: SerializedProperty;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: () => void;
}> = observer(({ property, className, disabled, readOnly, onChange }) => {
  return (
    <Checkbox
      className={cn("", className)}
      checked={property.booleanValue}
      disabled={disabled || readOnly}
      onCheckedChange={(e) => {
        property.booleanValue = !!e;
        property.serializedObject.applyModifiedProperties();
        onChange?.();
      }}
    />
  );
});
