import { Scene } from "@atlas/engine";
import { BackgroundSystem, Container, WebGLRenderer } from "pixi.js";

export { BackgroundSystem } from "pixi.js";

export const EditorRenderer = new (class EditorRenderer {
  private webglRenderer: WebGLRenderer;

  constructor() {
    this.webglRenderer = new WebGLRenderer();

    this.webglRenderer.init({
      antialias: true,
      autoDensity: true,
      resolution: window.devicePixelRatio,
      powerPreference: "high-performance",
    });
  }

  public get background() {
    return this.webglRenderer.background;
  }

  public set background(value: BackgroundSystem | number) {
    const bg =
      value instanceof BackgroundSystem ? value : new BackgroundSystem();

    bg.color = value instanceof BackgroundSystem ? value.color : value;

    this.webglRenderer.background = bg;
  }

  public render(target: Scene | Container) {
    if (target instanceof Scene) {
      this.webglRenderer.render(target.sceneContainer);

      return;
    }

    this.webglRenderer.render(target);
  }

  public get canvas() {
    return this.webglRenderer.canvas;
  }

  public resize(width: number, height: number) {
    this.webglRenderer.resize(width, height);
  }

  public toBase64(target: Scene | Container) {
    return this.webglRenderer.extract.base64({
      target: target instanceof Scene ? target.sceneContainer : target,
      resolution: window.devicePixelRatio,
      antialias: true,
      quality: 1,
      format: "png",
    });
  }

  public clear() {
    this.webglRenderer.clear({
      clearColor: 0x000000,
    });
  }
})();
