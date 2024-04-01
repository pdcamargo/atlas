import { BaseLoader } from "./base-loader";

export class AudioLoader extends BaseLoader<HTMLAudioElement> {
  private cache: Map<string, HTMLAudioElement> = new Map();

  public supportedExtensions = [];

  public async load(path: string): Promise<HTMLAudioElement> {
    if (IS_ATLAS_EDITOR) {
      const { convertFileSrc } = await import("@tauri-apps/api/tauri");

      const fileSrc = convertFileSrc(path, "asset");

      return new Promise((resolve, reject) => {
        const audio = new Audio();

        audio.oncanplaythrough = () => {
          this.cache.set(path, audio);

          resolve(audio);
        };

        audio.onerror = (error) => {
          reject(error);
        };

        audio.src = fileSrc;
      });
    }

    // TODO: implement loading from the binary asset resources
    return new Promise((resolve, reject) => {
      const audio = new Audio();

      audio.oncanplaythrough = () => {
        this.cache.set(path, audio);

        resolve(audio);
      };

      audio.onerror = (error) => {
        reject(error);
      };

      audio.src = path;
    });
  }
}
