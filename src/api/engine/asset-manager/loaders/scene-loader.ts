import { Scene, fs } from "../..";
import { BaseLoader } from "./base-loader";

type SceneMetadata = {};

export class SceneLoader extends BaseLoader<Scene> {
  public supportedExtensions = ["scene"];

  public async load(path: string): Promise<Scene> {
    const sceneJson = await fs.readJson<{
      name: string;
      id: string;
    }>(path);

    return new Scene({
      name: sceneJson.name,
      id: sceneJson.id,
    });
  }

  public override createDefaultMedata(): SceneMetadata {
    return {};
  }
}
