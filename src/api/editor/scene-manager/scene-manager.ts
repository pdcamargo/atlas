import { makeAutoObservable } from "mobx";
import { EditorScene } from "./editor-scene";
import {
  Scene,
  Serialization,
  fs,
  path,
  SceneManager as EngineSceneManager,
} from "@atlas/engine";
import { EditorRenderer, Project } from "..";

export const SceneManager = new (class SceneManager {
  public currentScene: EditorScene | null = null;

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  setCurrentScene(scene: EditorScene) {
    if (this.currentScene) {
      EditorRenderer.clear();
    }

    this.currentScene = scene;
    EngineSceneManager.setCurrentScene(scene.scene);
  }

  public async newScene(name: string, targetPath: string) {
    const scene = new Scene({ name });

    const sceneJson = Serialization.serialize(scene);

    const project = Project.getCurrent();

    if (!project) {
      throw new Error("No project selected");
    }

    targetPath = (await path.resolve(targetPath)).replace(
      await path.resolve(`${project.path}/src`),
      ""
    );

    const scenePath = await path.join(
      project.path,
      "src",
      targetPath !== "root" ? targetPath : "",
      `${name}.scene`
    );

    await fs.writeJson(scenePath, sceneJson);

    const editorScene = new EditorScene(scene, scenePath);

    return editorScene;
  }
})();
