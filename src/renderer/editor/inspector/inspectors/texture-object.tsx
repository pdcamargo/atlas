import { observer } from "mobx-react-lite";

import { EditorRenderer, SceneManager, SerializedObject } from "@atlas/editor";
import { SpriteObject, TextureObject } from "@atlas/engine";

import * as Properties from "../properties";
import { Field } from "./field";
import { SpriteImage } from "./sprite-img";
import { useEffect } from "react";

type TextureObjectInspectorProps = {
  textureObject: SerializedObject<TextureObject>;
};

export const TextureObjectInspector = observer(
  ({ textureObject }: TextureObjectInspectorProps) => {
    const metadata = textureObject.findProperty("metadata");
    const sprites = textureObject.findProperty("sprites");

    useEffect(() => {
      if (sprites.arrayValue.length > 0) {
        console.log(sprites.arrayValue[0]);
        SceneManager.currentScene?.container.addChild(
          sprites.arrayValue[0].sprite
        );
      }
    }, [sprites.arrayValue]);

    return (
      <div>
        <div className="border-b">
          {metadata.findProperty("textureName").stringValue}
        </div>

        <div>
          <div>Texture Object</div>

          <div>
            {sprites.arrayValue.map((sprite: SpriteObject) => {
              return (
                <div key={sprite.name}>
                  <div>{sprite.name}</div>
                  <SpriteImage sprite={sprite.sprite} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);
