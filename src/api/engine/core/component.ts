import { ComponentConstructorArgs, IComponent, IGameObject } from "./types";

export class Component implements IComponent {
  id: string;
  gameObject: IGameObject;

  constructor({ gameObject, id }: ComponentConstructorArgs) {
    this.id = id || crypto.randomUUID();
    this.gameObject = gameObject;
  }

  onAwake() {}
  onStart() {}

  onUpdate() {}
  onEarlyUpdate() {}
  onLateUpdate() {}

  onDestroy() {}
  onEnable() {}
}
