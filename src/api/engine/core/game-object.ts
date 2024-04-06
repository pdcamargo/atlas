import { Transform } from "./transform";
import {
  ComponentConstructor,
  IComponent,
  IGameObject,
  IGameObjectConstructorArgs,
} from "./types";

export class GameObject implements IGameObject {
  public readonly id: string;

  public name: string;
  public parent: IGameObject | null;

  public readonly components: IComponent[];
  public children: IGameObject[];
  public readonly transform: Transform;

  constructor({
    id,
    name,
    components = [],
    parent = null,
    children = [],
    transform,
  }: IGameObjectConstructorArgs) {
    this.id = id || crypto.randomUUID();
    this.name = name ?? "GameObject";
    this.components = components;
    this.parent = parent;
    this.children = children;
    this.transform = transform || new Transform({ gameObject: this });

    this.children.forEach((child) => (child.parent = this));
  }

  getComponent = <T extends IComponent>(type: ComponentConstructor<T>): T => {
    const foundComponent = this.components.find(
      (component) => component instanceof type
    );

    if (!foundComponent) {
      throw new Error(`Component of type ${type.name} not found`);
    }

    return foundComponent as T;
  };

  tryGetComponent = <T extends IComponent>(
    type: ComponentConstructor<T>
  ): T | null => {
    try {
      return this.getComponent(type);
    } catch {
      return null;
    }
  };

  addComponent = <T extends IComponent>(type: ComponentConstructor<T>): T => {
    const component = new type({ gameObject: this });

    this.components.push(component);

    return component;
  };

  hasComponent = <T extends IComponent>(
    type: ComponentConstructor<T>
  ): boolean => {
    return this.components.some((component) => component instanceof type);
  };

  getComponents = <T extends IComponent>(
    type: ComponentConstructor<T>
  ): T[] => {
    return this.components.filter(
      (component) => component instanceof type
    ) as T[];
  };

  getComponentInChildren = <T extends IComponent>(
    type: ComponentConstructor<T>
  ): T | null => {
    if (this.hasComponent(type)) {
      return this.getComponent(type);
    }

    for (const child of this.children) {
      if (child.hasComponent(type)) {
        return child.getComponent(type);
      }
    }

    return null;
  };

  getComponentsInChildren = <T extends IComponent>(
    type: ComponentConstructor<T>
  ): T[] => {
    const components: T[] = [];

    components.push(...this.getComponents(type));

    for (const child of this.children) {
      components.push(...child.getComponents(type));
    }

    return components;
  };

  getComponentInParent = <T extends IComponent>(
    type: ComponentConstructor<T>
  ): T | null => {
    if (!this.parent) {
      return null;
    }

    if (this.hasComponent(type)) {
      return this.getComponent(type);
    }

    if (this.parent.hasComponent(type)) {
      return this.parent.getComponent(type);
    }

    return this.parent.getComponentInParent(type);
  };

  getComponentsInParent = <T extends IComponent>(
    type: ComponentConstructor<T>
  ): T[] => {
    const components: T[] = [];

    components.push(...this.getComponents(type));

    if (this.parent) {
      components.push(...this.parent.getComponents(type));
    }

    return components;
  };

  removeComponent<T extends IComponent>(type: ComponentConstructor<T>): void {
    const index = this.components.findIndex(
      (component) => component instanceof type
    );

    if (index === -1) {
      throw new Error(`Component of type ${type.name} not found`);
    }

    this.components.splice(index, 1);
  }
}
