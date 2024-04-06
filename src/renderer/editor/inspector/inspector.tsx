import { observer } from "mobx-react-lite";

import { Selection, SerializedObject } from "@atlas/editor";
import { GameObject, TextureObject } from "@atlas/engine";
import { useEffect, useState } from "react";

import * as Properties from "./properties";
import { GameObjectInspector } from "./inspectors/game-object";
import { TextureObjectInspector } from "./inspectors/texture-object";
import { Droppable } from "@/components/ui/droppable";

export const Inspector = observer(() => {
  const [serialized, setSerialized] = useState<SerializedObject | null>(null);

  useEffect(() => {
    if (Selection.isSelection(GameObject)) {
      setSerialized(new SerializedObject(Selection.selected));
    } else if (Selection.isSelection(TextureObject)) {
      setSerialized(new SerializedObject(Selection.selected));
    } else {
      setSerialized(null);
    }
  }, [Selection.selected]);

  if (!serialized) {
    return null;
  }

  return (
    <Droppable
      accept="asset"
      asChild
      canDrop={() => true}
      onDrop={() => {
        alert("Dropped");
      }}
    >
      <div>
        {serialized.targetObject instanceof GameObject && (
          <GameObjectInspector gameObject={serialized} />
        )}
        {serialized.targetObject instanceof TextureObject && (
          <TextureObjectInspector textureObject={serialized} />
        )}
      </div>
    </Droppable>
  );
});
