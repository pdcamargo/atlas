import { SerializedProperty } from "@atlas/editor";
import { observer } from "mobx-react-lite";

import * as Properties from "./";

export const PropertyRenderer: React.FC<{
  property: SerializedProperty;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: () => void;
}> = observer(({ property, ...rest }) => {
  const commonProps = {
    property,
    ...rest,
  };

  if (property.isNumber) {
    return <Properties.NumberProperty {...commonProps} />;
  }

  if (property.isString) {
    return <Properties.StringProperty {...commonProps} />;
  }

  if (property.isBoolean) {
    return <Properties.BooleanProperty {...commonProps} />;
  }

  if (property.isVector2) {
    return <Properties.Vector2Property {...commonProps} />;
  }

  if (property.isSprite) {
    return <Properties.SpriteProperty {...commonProps} />;
  }

  return null;
});
