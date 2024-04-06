import { BaseLoader } from "./base-loader";

export class ImageLoader extends BaseLoader<HTMLImageElement> {
  private cache: Map<string, HTMLImageElement> = new Map();

  public supportedExtensions = ["png", "jpg", "jpeg", "gif", "webp"];

  public loadWithMetadata(
    path: string,
    metadata: Record<string, any>
  ): Promise<HTMLImageElement> {
    return this.load(path);
  }

  public async load(path: string): Promise<HTMLImageElement> {
    if (this.cache.has(path)) {
      return this.cache.get(path)!;
    }

    if (IS_ATLAS_EDITOR) {
      const { convertFileSrc } = await import("@tauri-apps/api/tauri");
      const fileSrc = convertFileSrc(path, "asset");

      return new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = () => {
          this.cache.set(path, image);

          resolve(image);
        };

        image.onerror = (error) => {
          reject(error);
        };

        image.src = fileSrc;
      });
    }

    // TODO: implement loading from the binary asset resources
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        this.cache.set(path, image);

        resolve(image);
      };

      image.onerror = (error) => {
        reject(error);
      };

      image.src = path;
    });
  }
}
