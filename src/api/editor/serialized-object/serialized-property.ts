import { makeAutoObservable } from "mobx";
import { SerializedObject } from ".";
import { Vector2, Color, Rect, Transform } from "@atlas/engine";

export class SerializedProperty {
  private _newValue: any;

  constructor(
    public readonly serializedObject: SerializedObject,
    public readonly path: string,
    public originalValue: any
  ) {
    makeAutoObservable(
      this,
      {
        serializedObject: false,
      },
      { autoBind: true }
    );

    this._newValue = originalValue;
  }

  public get isDirty() {
    return this._newValue !== this.originalValue;
  }

  public findProperty(relativePath: string) {
    return this.serializedObject.findProperty(`${this.path}.${relativePath}`);
  }

  public get hasChildren() {
    // if this is an object or array, it has children
    if (!this._newValue) {
      return false;
    }

    return typeof this._newValue === "object" || Array.isArray(this._newValue);
  }

  public getChildren() {
    if (!this.hasChildren) {
      return [];
    }

    const children: SerializedProperty[] = [];

    if (Array.isArray(this._newValue)) {
      for (let i = 0; i < this._newValue.length; i += 1) {
        const value = this._newValue[i];
        const path = `${this.path}[${i}]`;
        const property = this.serializedObject.findProperty(path);
        if (property) {
          children.push(property);
        } else {
          children.push(
            new SerializedProperty(this.serializedObject, path, value)
          );
        }
      }
    } else {
      Object.keys(this._newValue).forEach((key) => {
        const value = this._newValue[key];

        const property = this.findProperty(key);

        if (property) {
          children.push(property);
        } else {
          children.push(
            new SerializedProperty(
              this.serializedObject,
              `${this.path}.${key}`,
              value
            )
          );
        }
      });
    }

    return children;
  }

  public get depth() {
    // Combine split logic for dot and array notations into a single operation
    const segments = this.path.match(/[^.[\]]+|\[.*?\]/g) || [];
    return segments.length;
  }

  private setValue(value: any) {
    this._newValue = value;
  }

  private get lastSegment() {
    // get last segment of the path
    const segments = this.path.match(/[^.[\]]+|\[.*?\]/g) || [];
    return segments[segments.length - 1];
  }

  public get displayName() {
    // get last segment of the path, then covert snake_case, camelCase, PascalCase to human readable

    const { lastSegment } = this;

    // convert snake_case, camelCase, PascalCase to human readable
    return lastSegment
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .trim();
  }

  public get value() {
    return this._newValue;
  }

  public set value(value: any) {
    this.setValue(value);
  }

  public get vector2Value() {
    if (!(this._newValue instanceof Vector2)) {
      throw new Error("Value is not a Vector2");
    }

    return this._newValue;
  }

  public set vector2Value(value: Vector2) {
    if (!(value instanceof Vector2)) {
      throw new Error("Value is not a Vector2");
    }

    this.setValue(value);
  }

  public get colorValue() {
    if (!(this._newValue instanceof Color)) {
      throw new Error("Value is not a Color");
    }

    return this._newValue;
  }

  public set colorValue(value: Color) {
    if (!(value instanceof Color)) {
      throw new Error("Value is not a Color");
    }

    this.setValue(value);
  }

  public get rectValue() {
    if (!(this._newValue instanceof Rect)) {
      throw new Error("Value is not a Rect");
    }

    return this._newValue;
  }

  public set rectValue(value: Rect) {
    if (!(value instanceof Rect)) {
      throw new Error("Value is not a Rect");
    }

    this.setValue(value);
  }

  public get numberValue() {
    if (typeof this._newValue !== "number") {
      throw new Error("Value is not a number");
    }

    return this._newValue;
  }

  public set numberValue(value: number) {
    if (typeof value !== "number") {
      throw new Error("Value is not a number");
    }

    this.setValue(value);
  }

  public get stringValue() {
    if (typeof this._newValue !== "string") {
      throw new Error("Value is not a string");
    }

    return this._newValue;
  }

  public set stringValue(value: string) {
    if (typeof value !== "string") {
      throw new Error("Value is not a string");
    }

    this.setValue(value);
  }

  public get booleanValue() {
    if (typeof this._newValue !== "boolean") {
      throw new Error("Value is not a boolean");
    }

    return this._newValue;
  }

  public set booleanValue(value: boolean) {
    if (typeof value !== "boolean") {
      throw new Error("Value is not a boolean");
    }

    this.setValue(value);
  }

  public get transformValue() {
    if (!(this._newValue instanceof Transform)) {
      throw new Error("Value is not a Transform");
    }

    return this._newValue;
  }

  public set transformValue(value: Transform) {
    if (!(value instanceof Transform)) {
      throw new Error("Value is not a Transform");
    }

    this.setValue(value);
  }
}
