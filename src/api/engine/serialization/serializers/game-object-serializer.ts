import { BaseSerializer, ClassConstructor } from ".";
import { GameObject } from "../..";

export class GameObjectSerializer extends BaseSerializer {
  serializeClass: ClassConstructor<GameObject>;

  serialize(data: GameObject): Record<string, any> | string {
    const recursiveSerialize = (obj: GameObject): any => {
      return {
        id: obj.id,
        parentId: obj.parent?.id || null,
        name: obj.name,
        children: obj.children.map((child) => recursiveSerialize(child)),
        components: [],
      };
    };

    return recursiveSerialize(data);
  }

  deserialize(data: string | Record<string, any>): GameObject {
    data = typeof data === "string" ? JSON.parse(data) : data;

    const recursiveDeserialize = (obj: any): GameObject => {
      const gameObject = new GameObject({
        id: obj.id,
        name: obj.name,
      });

      gameObject.children = obj.children.map((child: any) =>
        recursiveDeserialize(child)
      );

      return gameObject;
    };

    return recursiveDeserialize(data);
  }
}
