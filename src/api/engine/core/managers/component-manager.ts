import { components } from "../components";
import { ComponentConstructor, IComponent } from "../types";

export const ComponentManager = new (class ComponentManager {
  public readonly components: Map<string, ComponentConstructor<IComponent>> =
    new Map();

  constructor() {
    this.components = new Map();

    for (const component of components) {
      this.registerComponent(component);
    }
  }

  public registerComponent<T extends IComponent>(
    type: ComponentConstructor<T>
  ) {
    this.components.set(type.name, type);
  }

  public getComponent<T extends IComponent>(
    name: string
  ): ComponentConstructor<T> {
    if (!this.components.has(name)) {
      throw new Error(`Component "${name}" not found`);
    }

    return this.components.get(name) as ComponentConstructor<T>;
  }

  public tryGetComponent<T extends IComponent>(
    name: string
  ): ComponentConstructor<T> | null {
    try {
      return this.getComponent(name);
    } catch {
      return null;
    }
  }

  public hasComponent(name: string): boolean {
    return this.components.has(name);
  }

  public getComponentNames(): string[] {
    return Array.from(this.components.keys());
  }
})();
