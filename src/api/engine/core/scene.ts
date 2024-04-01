import * as PIXI from "pixi.js";

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

  /**
   * The container that will be rendered to the screen.
   */
  private readonly sceneContainer: PIXI.Container;

  /**
   * The container that will hold all the game objects.
   *
   * This will be automatically added to the `container` property. Useful for implementing camera systems.
   */
  public readonly container: PIXI.Container;

  constructor({ name, id, root }: ISceneConstructorArgs) {
    this.id = id || crypto.randomUUID();
    this.name = name;
    this.root =
      root ??
      new GameObject({
        children: [],
        components: [],
        id: crypto.randomUUID(),
        name: "Root",
        parent: null,
      });

    this.sceneContainer = new PIXI.Container();
    this.container = new PIXI.Container();

    this.sceneContainer.addChild(this.container);
  }
  findGameObjectById(id: string, recursive = true): IGameObject | null {
    const queue = [this.root];

    while (queue.length) {
      const gameObject = queue.shift()!;

      if (gameObject.id === id) {
        return gameObject;
      }

      if (recursive) {
        queue.push(...gameObject.children);
      }
    }

    return null;
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
    const go = new GameObject({
      ...args,
    });

    this.addGameObject(go);

    return go;
  }
}
