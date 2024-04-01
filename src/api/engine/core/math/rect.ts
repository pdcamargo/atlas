import { Vector2 } from './vector2';

export class Rect {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
  ) {}

  public get left() {
    return this.x;
  }

  public get right() {
    return this.x + this.width;
  }

  public get top() {
    return this.y;
  }

  public get bottom() {
    return this.y + this.height;
  }

  public get center(): Vector2 {
    return new Vector2(this.x + this.width / 2, this.y + this.height / 2);
  }

  public contains(point: Vector2): boolean {
    return (
      point.x >= this.left &&
      point.x <= this.right &&
      point.y >= this.top &&
      point.y <= this.bottom
    );
  }
}
