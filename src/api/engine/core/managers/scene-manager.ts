import { Scene } from "..";

export class SceneManager {
  public static currentScene: Scene | null = null;

  public static setCurrentScene(scene: Scene) {
    SceneManager.currentScene = scene;
  }
}
