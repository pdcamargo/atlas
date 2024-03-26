import { GameObject } from "./game-object";
import {
  ComponentConstructor,
  IComponent,
  IGameObject,
  IGameObjectConstructorArgs,
  IScene,
  ISceneConstructorArgs,
} from "./types";

export class Scene implements IScene {
  readonly id: string;

  name: string;

  readonly root: IGameObject;

  constructor({ name, id }: ISceneConstructorArgs) {
    this.id = id || crypto.randomUUID();
    this.name = name;
    this.root = new GameObject({
      scene: this,
      children: [],
      components: [],
      id: crypto.randomUUID(),
      name: "Root",
      parent: null,
    });
  }

  findGameObjectByType<T extends IComponent>(
    type: ComponentConstructor<T>,
    recursive = false
  ): IGameObject | null {
    const queue = [this.root];

    while (queue.length) {
      const gameObject = queue.shift()!;

      if (gameObject.hasComponent(type)) {
        return gameObject;
      }

      if (recursive) {
        queue.push(...gameObject.children);
      }
    }

    return null;
  }

  findGameObjectsByType<T extends IComponent>(
    type: ComponentConstructor<T>,
    recursive = false
  ): IGameObject[] {
    const queue = [this.root];
    const foundGameObjects: IGameObject[] = [];

    while (queue.length) {
      const gameObject = queue.shift()!;

      if (gameObject.hasComponent(type)) {
        foundGameObjects.push(gameObject);
      }

      if (recursive) {
        queue.push(...gameObject.children);
      }
    }

    return foundGameObjects;
  }

  findGameObjectByName(name: string, recursive = false): IGameObject | null {
    const queue = [this.root];

    while (queue.length) {
      const gameObject = queue.shift()!;

      if (gameObject.name === name) {
        return gameObject;
      }

      if (recursive) {
        queue.push(...gameObject.children);
      }
    }

    return null;
  }

  findGameObjectsByName(name: string, recursive = false): IGameObject[] {
    const queue = [this.root];
    const foundGameObjects: IGameObject[] = [];

    while (queue.length) {
      const gameObject = queue.shift()!;

      if (gameObject.name === name) {
        foundGameObjects.push(gameObject);
      }

      if (recursive) {
        queue.push(...gameObject.children);
      }
    }

    return foundGameObjects;
  }

  addGameObject(gameObject: IGameObject): void {
    this.root.children.push(gameObject);

    gameObject.parent = null;
  }

  createGameObject(
    args: Omit<IGameObjectConstructorArgs, "scene">
  ): IGameObject {
    return new GameObject({
      ...args,
      scene: this,
    });
  }
}
