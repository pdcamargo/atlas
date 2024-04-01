import { Scene } from "@atlas/engine";
import { makeAutoObservable } from "mobx";

export class EditorScene {
  public scene: Scene;
  public scenePath: string = "";

  constructor(scene: Scene, scenePath = "") {
    makeAutoObservable(this, undefined, { autoBind: true });

    this.scene = scene;
    this.scenePath = scenePath;
  }

  public get gameObjects() {
    return this.scene.root.children;
  }

  public get isOnDisk() {
    return this.scenePath !== "";
  }
}
