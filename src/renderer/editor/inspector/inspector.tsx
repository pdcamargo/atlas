import { observer } from "mobx-react-lite";

import { Selection, SerializedObject } from "@atlas/editor";
import { GameObject } from "@atlas/engine";
import { useEffect, useState } from "react";

export const Inspector = observer(() => {
  const [serialized, setSerialized] =
    useState<SerializedObject<GameObject> | null>(null);

  useEffect(() => {
    if (Selection.isSelection(GameObject)) {
      setSerialized(new SerializedObject(Selection.selected));
    } else {
      setSerialized(null);
    }
  }, [Selection.selected]);

  if (!serialized) {
    return null;
  }

  const name = serialized.findProperty("name");
  const transform = serialized.findProperty("transform");

  return (
    <div>
      <div className="border-b">{name.stringValue}</div>

      <div>
        <div>Transform</div>
        <div>
          <div>
            <div>Position</div>
            <div>
              <input
                type="number"
                defaultValue={transform.findProperty("position.x").numberValue}
                onChange={(e) => {
                  transform.findProperty("position.x").numberValue =
                    e.currentTarget.valueAsNumber;
                }}
              />
              <input
                type="number"
                value={transform.findProperty("position.y").numberValue}
                onChange={(e) => {
                  transform.findProperty("position.y").numberValue =
                    e.currentTarget.valueAsNumber;
                }}
              />
            </div>
          </div>
          <div>
            <div>Rotation</div>
            <div>
              <input
                type="number"
                value={transform.findProperty("rotation").numberValue}
                onChange={(e) => {
                  transform.findProperty("rotation").numberValue =
                    e.currentTarget.valueAsNumber;
                }}
              />
            </div>
          </div>
          <div>
            <div>Scale</div>
            <div>
              <input
                type="number"
                value={transform.findProperty("scale.x").numberValue}
                onChange={(e) => {
                  transform.findProperty("scale.x").numberValue =
                    e.currentTarget.valueAsNumber;
                }}
              />
              <input
                type="number"
                value={transform.findProperty("scale.y").numberValue}
                onChange={(e) => {
                  transform.findProperty("scale.y").numberValue =
                    e.currentTarget.valueAsNumber;
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
