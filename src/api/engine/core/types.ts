import { Vector2 } from "./math";

export type IComponent = {
  readonly id: string;
  gameObject: IGameObject;

  onAwake(): void;
  onStart(): void;

  onUpdate(): void;
  onLateUpdate(): void;
  onEarlyUpdate(): void;

  onDestroy(): void;

  /**
   * Called when the component is enabled.
   *
   * This is also called by the editor when the component is added to a game object whether the game is running or not.
   */
  onEnable(): void;
};

export type ITransform = {
  readonly gameObject: IGameObject;
  position: Vector2;
  rotation: number;
  scale: Vector2;

  /**
   * Local position, differently from position, is relative to the parent's position.
   */
  localPosition: Vector2;

  /**
   * Local rotation, differently from rotation, is relative to the parent's rotation.
   */
  localRotation: number;

  /**
   * Local scale, differently from scale, is relative to the parent's scale.
   */
  localScale: Vector2;

  worldPosition: Vector2;
  worldRotation: number;
  worldScale: Vector2;
};

export type ComponentConstructorArgs = {
  id?: string;
  gameObject: IGameObject;
};

export type ComponentConstructor<T> = new (args: ComponentConstructorArgs) => T;

export type IGameObjectConstructorArgs = {
  id?: string;
  name?: string;
  components?: IComponent[];
  parent?: IGameObject | null;
  children?: IGameObject[];
  transform?: ITransform;
};

export type IGameObjectConstructor = new (
  args: IGameObjectConstructorArgs
) => IGameObject;

export type IGameObject = {
  readonly id: string;

  name: string;
  parent: IGameObject | null;

  readonly components: IComponent[];
  readonly children: IGameObject[];
  readonly transform: ITransform;

  getComponent<T extends IComponent>(type: ComponentConstructor<T>): T;

  getComponents<T extends IComponent>(type: ComponentConstructor<T>): T[];

  getComponentInChildren<T extends IComponent>(
    type: ComponentConstructor<T>
  ): T | null;

  getComponentsInChildren<T extends IComponent>(
    type: ComponentConstructor<T>
  ): T[];

  getComponentInParent<T extends IComponent>(
    type: ComponentConstructor<T>
  ): T | null;

  getComponentsInParent<T extends IComponent>(
    type: ComponentConstructor<T>
  ): T[];

  tryGetComponent<T extends IComponent>(
    type: ComponentConstructor<T>
  ): T | null;

  addComponent<T extends IComponent>(type: ComponentConstructor<T>): T;

  hasComponent<T extends IComponent>(type: ComponentConstructor<T>): boolean;
};

export type ISceneConstructorArgs = {
  id?: string;
  name: string;
  root?: IGameObject;
};

export type ISceneConstructor = new (args: ISceneConstructorArgs) => IScene;

export type IScene = {
  readonly id: string;

  name: string;
  readonly root: IGameObject;

  findGameObjectByType<T extends IComponent>(
    type: ComponentConstructor<T>,
    recursive?: boolean
  ): IGameObject | null;

  findGameObjectsByType<T extends IComponent>(
    type: ComponentConstructor<T>,
    recursive?: boolean
  ): IGameObject[];

  findGameObjectByName(name: string, recursive?: boolean): IGameObject | null;

  findGameObjectsByName(name: string, recursive?: boolean): IGameObject[];

  findGameObjectById(id: string, recursive?: boolean): IGameObject | null;

  addGameObject(gameObject: IGameObject): void;

  createGameObject(
    args: Omit<IGameObjectConstructorArgs, "scene">
  ): IGameObject;
};
