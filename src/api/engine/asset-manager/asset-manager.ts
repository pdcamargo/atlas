import { AudioLoader, SceneLoader, TextureLoader } from "./loaders";
import { BaseLoader } from "./loaders/base-loader";

export class AssetManager {
  private static readonly loaders: Set<BaseLoader> = new Set([
    new TextureLoader(),
    new AudioLoader(),
    new SceneLoader(),
  ]);

  public static get textureLoader() {
    return Array.from(this.loaders).find(
      (loader) => loader instanceof TextureLoader
    ) as TextureLoader;
  }

  public static async load<T>(path: string): Promise<T> {
    for (const loader of this.loaders) {
      if (loader.supportedExtensions.some((ext) => path.endsWith(ext))) {
        return loader.load(path) as Promise<T>;
      }
    }

    throw new Error(`No loader found for the asset: ${path}`);
  }

  public static async loadWithMetadata<T>(
    path: string,
    metadata: Record<string, any>
  ): Promise<T> {
    for (const loader of this.loaders) {
      if (loader.supportedExtensions.some((ext) => path.endsWith(ext))) {
        return loader.loadWithMetadata(path, metadata) as Promise<T>;
      }
    }

    throw new Error(`No loader found for the asset: ${path}`);
  }

  public static createDefaultMedata(path: string) {
    const loader = this.getLoader(path);

    if (!loader) {
      throw new Error(
        `No loader found for the asset: ${path}. Cannot create default metadata.`
      );
    }

    return loader.createDefaultMedata();
  }

  private static getLoader(path: string) {
    for (const loader of this.loaders) {
      if (loader.supportedExtensions.some((ext) => path.endsWith(ext))) {
        return loader;
      }
    }

    return null;
  }
}
