import { Vector2 } from "./math";
import { IGameObject, ITransform } from "./types";

export class Transform implements ITransform {
  public readonly gameObject: IGameObject;
  public position: Vector2;
  public rotation: number;
  public scale: Vector2;

  constructor({
    gameObject,
    position = new Vector2(0, 0),
    rotation = 0,
    scale = new Vector2(1, 1),
  }: {
    gameObject: IGameObject;
    position?: Vector2;
    rotation?: number;
    scale?: Vector2;
  }) {
    this.gameObject = gameObject;
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }

  public get localPosition(): Vector2 {
    if (!this.gameObject.parent) {
      return this.position;
    }

    const parentPosition = this.gameObject.parent.transform.position;

    return new Vector2(
      this.position.x - parentPosition.x,
      this.position.y - parentPosition.y
    );
  }

  public set localPosition(value: Vector2) {
    if (!this.gameObject.parent) {
      this.position = value;
      return;
    }

    const parentPosition = this.gameObject.parent.transform.position;

    this.position = new Vector2(
      value.x + parentPosition.x,
      value.y + parentPosition.y
    );
  }

  public get localRotation(): number {
    if (!this.gameObject.parent) {
      return this.rotation;
    }

    const parentRotation = this.gameObject.parent.transform.rotation;

    return this.rotation - parentRotation;
  }

  public set localRotation(value: number) {
    if (!this.gameObject.parent) {
      this.rotation = value;
      return;
    }

    const parentRotation = this.gameObject.parent.transform.rotation;

    this.rotation = value + parentRotation;
  }

  public get localScale(): Vector2 {
    if (!this.gameObject.parent) {
      return this.scale;
    }

    const parentScale = this.gameObject.parent.transform.scale;

    return new Vector2(
      this.scale.x / parentScale.x,
      this.scale.y / parentScale.y
    );
  }

  public set localScale(value: Vector2) {
    if (!this.gameObject.parent) {
      this.scale = value;
      return;
    }

    const parentScale = this.gameObject.parent.transform.scale;

    this.scale = new Vector2(value.x * parentScale.x, value.y * parentScale.y);
  }

  public get worldPosition(): Vector2 {
    if (!this.gameObject.parent) {
      return this.position;
    }

    const parentPosition = this.gameObject.parent.transform.position;

    return new Vector2(
      this.position.x + parentPosition.x,
      this.position.y + parentPosition.y
    );
  }

  public set worldPosition(value: Vector2) {
    if (!this.gameObject.parent) {
      this.position = value;
      return;
    }

    const parentPosition = this.gameObject.parent.transform.position;

    this.position = new Vector2(
      value.x - parentPosition.x,
      value.y - parentPosition.y
    );
  }

  public get worldRotation(): number {
    if (!this.gameObject.parent) {
      return this.rotation;
    }

    const parentRotation = this.gameObject.parent.transform.rotation;

    return this.rotation + parentRotation;
  }

  public set worldRotation(value: number) {
    if (!this.gameObject.parent) {
      this.rotation = value;
      return;
    }

    const parentRotation = this.gameObject.parent.transform.rotation;

    this.rotation = value - parentRotation;
  }

  public get worldScale(): Vector2 {
    if (!this.gameObject.parent) {
      return this.scale;
    }

    const parentScale = this.gameObject.parent.transform.scale;

    return new Vector2(
      this.scale.x * parentScale.x,
      this.scale.y * parentScale.y
    );
  }

  public set worldScale(value: Vector2) {
    if (!this.gameObject.parent) {
      this.scale = value;
      return;
    }

    const parentScale = this.gameObject.parent.transform.scale;

    this.scale = new Vector2(value.x / parentScale.x, value.y / parentScale.y);
  }
}
