import { Scene, Serialization, fs } from "../..";
import { BaseLoader } from "./base-loader";

type SceneMetadata = {};

export class SceneLoader extends BaseLoader<Scene> {
  public supportedExtensions = ["scene"];

  public loadWithMetadata(
    path: string,
    metadata: Record<string, any>
  ): Promise<Scene> {
    return this.load(path);
  }

  public async load(path: string): Promise<Scene> {
    const sceneJson = await fs.readJson<Record<string, any>>(path);

    return Serialization.deserialize(sceneJson, Scene);
  }

  public override createDefaultMedata(): SceneMetadata {
    return {};
  }
}
