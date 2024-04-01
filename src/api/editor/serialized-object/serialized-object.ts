import { makeAutoObservable } from "mobx";
import { SerializedProperty } from "./serialized-property";
import { get } from "../utils";

const NOT_FOUND_SYMBOL = Symbol("NOT_FOUND");

export class SerializedObject<T = any> {
  private _properties: Map<string, SerializedProperty> = new Map();

  constructor(public readonly targetObject: T) {
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  public get isDirty() {
    return Array.from(this._properties.values()).some((p) => p.isDirty);
  }

  public findProperty(path: string) {
    const originalPropertyValue = get(
      this.targetObject,
      path,
      // Casting to any because this is a special case, we are making sure that the value was actually not found
      // but value return could be undefined, but the key exists in the object
      NOT_FOUND_SYMBOL as any
    );

    if (originalPropertyValue === NOT_FOUND_SYMBOL) {
      throw new Error(`Property not found: ${path}`);
    }

    // if already serialized, return the existing one
    const existingProperty = this._properties.get(path);

    if (existingProperty) {
      return existingProperty;
    }

    const sp = new SerializedProperty(this, path, originalPropertyValue);

    this._properties.set(path, sp);

    return sp;
  }

  public applyModifiedProperties() {
    // TODO: apply changes to the target object
    // TODO: add undo/redo functionality
  }

  public get allProperties() {
    if (!this.targetObject || !(typeof this.targetObject === "object")) {
      throw new Error("Target object is not an object");
    }

    const properties: SerializedProperty[] = [];

    Object.keys(this.targetObject).forEach((key) => {
      const path = key;
      const property = this.findProperty(path);
      properties.push(property);
    });

    return properties;
  }
}
