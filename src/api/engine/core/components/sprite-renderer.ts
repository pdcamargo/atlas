import { Container, Sprite } from "pixi.js";
import { Component, SceneManager, Vector2 } from "..";

export class SpriteRenderer extends Component {
  private container: Container = new Container();

  public sprite: Sprite = new Sprite();
  public flipX = false;
  public flipY = false;

  public override onEnable(): void {
    this.container.addChild(this.sprite);

    SceneManager.currentScene!.container.addChild(this.container);
  }

  public override onValidate(): void {
    if (this.sprite) {
      // check if is a different sprite
      const hasSprite = this.container.children.includes(this.sprite);

      if (!hasSprite && this.container.children.length > 0) {
        this.container.removeChildAt(0);
      }

      if (!hasSprite) {
        this.container.addChild(this.sprite);
      }
    }

    this.container.scale.x = this.flipX ? -1 : 1;
    this.container.scale.y = this.flipY ? -1 : 1;
  }

  public override onDestroy(): void {
    SceneManager.currentScene!.container.removeChild(this.container);

    this.container.destroy();
  }
}
