import { Scene } from "../..";
import { BaseSerializer, ClassConstructor } from "./base-serializer";
import { GameObjectSerializer } from "./game-object-serializer";

export class SceneSerializer extends BaseSerializer<Scene> {
  public readonly serializeClass: ClassConstructor<Scene> = Scene;

  private gameObjectSerializer = new GameObjectSerializer();

  public serialize(data: Scene): string {
    return JSON.stringify({
      id: data.id,
      name: data.name,
      root: this.gameObjectSerializer.serialize(data.root),
    });
  }

  public deserialize(data: string) {
    const json = JSON.parse(data);

    const scene = new Scene({
      id: json.id,
      name: json.name,
      root: this.gameObjectSerializer.deserialize(json.root),
    });

    return scene;
  }
}
