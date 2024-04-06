import { makeAutoObservable } from "mobx";
import { SerializedObject } from ".";
import { Vector2, Color, Rect, Transform } from "@atlas/engine";
import set from "lodash/set";
import { toTitleCase } from "../utils";
import { Sprite } from "pixi.js";

export class SerializedProperty {
  private _newValue: any;
  private _previousValue: any;

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
    this._previousValue = originalValue;
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

  public get largestChildDisplayNameLength() {
    if (!this.hasChildren) {
      return 0;
    }

    // loop through all children and get the largest display name
    let largest = 0;

    this.childProperties.forEach((child) => {
      if (child.displayName.length > largest) {
        largest = child.displayName.length;
      }
    });

    return largest;
  }

  public get childProperties() {
    if (!this.hasChildren) {
      return [];
    }

    const children: SerializedProperty[] = [];

    if (Array.isArray(this._newValue)) {
      for (let i = 0; i < this._newValue.length; i += 1) {
        console.log(this.path);
        const path = `${this.path}[${i}]`;
        const property = this.serializedObject.findProperty(path);
        children.push(property);
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
    return toTitleCase(lastSegment);
  }

  public applyChanges() {
    this._previousValue = this.originalValue;
    this.originalValue = this._newValue;

    set(this.serializedObject.targetObject, this.path, this._newValue);
  }

  public revertChanges() {
    this._newValue = this._previousValue;
    this.originalValue = this._previousValue;

    set(this.serializedObject.targetObject, this.path, this._previousValue);
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

  public get isVector2() {
    return this._newValue instanceof Vector2;
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

  public get isColor() {
    return this._newValue instanceof Color;
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

  public get isRect() {
    return this._newValue instanceof Rect;
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

  public get isNumber() {
    return typeof this._newValue === "number";
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

  public get isString() {
    return typeof this._newValue === "string";
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

  public get isBoolean() {
    return typeof this._newValue === "boolean";
  }

  public get spriteValue() {
    if (!(this._newValue instanceof Sprite)) {
      throw new Error("Value is not a Sprite");
    }

    return this._newValue;
  }

  public set spriteValue(value: Sprite) {
    if (!(value instanceof Sprite)) {
      throw new Error("Value is not a Sprite");
    }

    this.setValue(value);
  }

  public get isSprite() {
    return this._newValue instanceof Sprite;
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

  public get isTransform() {
    return this._newValue instanceof Transform;
  }

  public get arrayValue() {
    if (!Array.isArray(this._newValue)) {
      throw new Error("Value is not an array");
    }

    return this._newValue;
  }

  public set arrayValue(value: any[]) {
    if (!Array.isArray(value)) {
      throw new Error("Value is not an array");
    }

    this.setValue(value);
  }

  public get objectValue() {
    if (typeof this._newValue !== "object") {
      throw new Error("Value is not an object");
    }

    return this._newValue;
  }

  public set objectValue(value: any) {
    if (typeof value !== "object") {
      throw new Error("Value is not an object");
    }

    this.setValue(value);
  }
}
