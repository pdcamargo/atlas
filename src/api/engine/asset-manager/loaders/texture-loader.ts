import * as PIXI from "pixi.js";

import { BaseLoader } from "./base-loader";

export type ScaleMode =
  /** Pixelating scaling */
  | "nearest"
  /** Smooth scaling */
  | "linear";

type TextureMetadata = {
  scaleMode?: ScaleMode;
  antialias?: boolean;
  sprites: {
    [key: string]: {
      width?: number;
      height?: number;
      alpha?: number;
      anchor?: {
        x: number;
        y: number;
      };
      position: {
        x: number;
        y: number;
      };
      scale?: {
        x: number;
        y: number;
      };
      rotation?: number;
    };
  };
};

type SpriteObject = {
  sprite: PIXI.Sprite;
  name: string;
  metadata: TextureMetadata["sprites"][string];
};

export class TextureObject {
  public texture: PIXI.Texture;
  public sprites: SpriteObject[] = [];
  public metadata: TextureMetadata;

  constructor(image: HTMLImageElement, metadata: TextureMetadata) {
    this.metadata = metadata;
    this.texture = PIXI.Texture.from(image);

    for (const [key, spriteMetadata] of Object.entries(metadata.sprites)) {
      const sprite = new PIXI.Sprite({
        texture: new PIXI.Texture({
          source: this.texture.source,
          frame: new PIXI.Rectangle(
            spriteMetadata.position.x,
            spriteMetadata.position.y,
            spriteMetadata.width,
            spriteMetadata.height
          ),
        }),
        width: spriteMetadata.width,
        height: spriteMetadata.height,
        anchor: spriteMetadata.anchor,
        alpha: spriteMetadata.alpha,
        scale: spriteMetadata.scale,
        rotation: spriteMetadata.rotation,
      });

      this.sprites.push({
        sprite,
        name: key,
        metadata: spriteMetadata,
      });
    }
  }
}

export class TextureLoader extends BaseLoader<TextureObject> {
  private cache: Map<string, TextureObject> = new Map();

  public supportedExtensions = ["png", "jpg", "jpeg", "gif", "webp"];

  public async load(path: string): Promise<TextureObject> {
    if (this.cache.has(path)) {
      return this.cache.get(path)!;
    }

    if (IS_ATLAS_EDITOR) {
      const { convertFileSrc } = await import("@tauri-apps/api/tauri");
      const fileSrc = convertFileSrc(path, "asset");

      return new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = () => {
          const textureObject = new TextureObject(image, { sprites: {} });

          this.cache.set(path, textureObject);

          resolve(textureObject);
        };

        image.onerror = (error) => {
          reject(error);
        };

        image.src = fileSrc;
      });
    }

    // TODO: implement loading from the binary asset resources
    return Promise.reject(new Error("Not implemented"));
  }

  public createDefaultMedata(): TextureMetadata {
    return {
      scaleMode: "nearest",
      antialias: false,
      sprites: {
        default: {
          position: { x: 0, y: 0 },
          anchor: { x: 0, y: 0 },
        },
      },
    };
  }
}
