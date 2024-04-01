import { invoke } from "@tauri-apps/api/tauri";
import { convertFileSrc } from "@tauri-apps/api/tauri";

import { AssetType } from "./asset-type";

import { Asset } from ".";
import { fs } from "@atlas/engine/utils";
import { AssetManager } from "@atlas/engine";

export function getExtensionFromPath(filename: string): string | null {
  // Find the last occurrence of '.' in the filename.
  const lastIndexOfDot = filename.lastIndexOf(".");

  // Check if a dot is found, it is not at the start, and it is not at the end.
  if (lastIndexOfDot > 0 && lastIndexOfDot < filename.length - 1) {
    // Return the extension without the dot.
    return filename.substring(lastIndexOfDot + 1);
  }

  // Return null if no valid extension is found.
  return null;
}

export const guessAssetTypeFromPath = (targetPath: string): AssetType => {
  const ext = getExtensionFromPath(targetPath);

  if (!ext) {
    return AssetType.Unknown;
  }

  switch (ext) {
    case "png":
    case "jpg":
    case "jpeg":
    case "tga":
    case "bmp":
    case "gif":
    case "webp":
      return AssetType.Texture;
    case "ashader":
      return AssetType.Shader;
    case "scene":
      return AssetType.Scene;
    case "wav":
    case "mp3":
    case "ogg":
    case "flac":
    case "aac":
    case "m4a":
    case "opus":
      return AssetType.Audio;
    default:
      return AssetType.Unknown;
  }
};

export type FileDescriptor = {
  id: string;
  relativePath: string;
  absolutePath: string;
  metadataPath: string;
  metadata: Record<string, unknown>;
  parentId: string | null;
  name: string;
  fullName: string;
  assetType: string;
  isDirectory: boolean;
  assetPath: string;
};

export class VirtualFileSystem {
  paths: string[];
  rootPath: string;
  files: FileDescriptor[] = [];

  constructor(paths: string[]) {
    this.paths = paths;
    this.rootPath = VirtualFileSystem.normalizePath(paths[0]);
  }

  public async setupFiles() {
    const normalizedRootPath = this.rootPath.endsWith("/")
      ? this.rootPath
      : `${this.rootPath}/`;

    this.paths.slice(1).forEach(async (absolutePath) => {
      const originalPath = absolutePath;
      absolutePath = VirtualFileSystem.normalizePath(absolutePath);
      const metadataPath = absolutePath.replace(
        `${normalizedRootPath}`,
        `${normalizedRootPath.replace("src", "metadata")}`
      );

      const relativePath = absolutePath.replace(normalizedRootPath, "");
      const pathSegments = relativePath.split("/").filter(Boolean);
      const nameWithExtension = pathSegments.pop() ?? "";
      const parentId =
        pathSegments.length > 0
          ? `${normalizedRootPath}${pathSegments.join("/")}`
          : null;
      const [name, ...extensionParts] = nameWithExtension.split(".");
      const isDirectory =
        extensionParts.length === 0 || !extensionParts.join(".");

      const fileDescriptor: FileDescriptor = {
        id: absolutePath,
        relativePath,
        absolutePath,
        parentId,
        name: isDirectory ? nameWithExtension : name,
        fullName: nameWithExtension,
        assetType: guessAssetTypeFromPath(absolutePath),
        isDirectory,
        assetPath: convertFileSrc(originalPath, "asset"),
        metadata: await VirtualFileSystem.getMedataOrCreate(metadataPath),
        metadataPath,
      };

      this.files.push(fileDescriptor);
    });
  }

  private static normalizePath(path: string): string {
    return path.replace(/\\/g, "/").replace(/\/\/+/g, "/");
  }

  private static async getMedataOrCreate(metadataPath: string) {
    const metadataPathWithExt = `${metadataPath}.metadata`;
    const fileExists = await fs.exists(metadataPathWithExt);

    if (!fileExists) {
      let defaultMetadata: Record<string, unknown> = {};

      if (!(await fs.isDir(metadataPath))) {
        defaultMetadata = {
          uuid: crypto.randomUUID(),
          ...AssetManager.createDefaultMedata(metadataPath),
        };
      } else {
        defaultMetadata = {
          uuid: crypto.randomUUID(),
        };
      }

      await fs.ensureDir(metadataPath);

      await fs.writeJson(metadataPathWithExt, defaultMetadata);

      return defaultMetadata;
    }

    return (await fs.readJson(metadataPath)) as Record<string, unknown>;
  }
}

export class AssetDatabase {
  public static readonly assets: Asset<unknown>[] = [];

  public static async loadFileSystem(rootPath: string) {
    if (!rootPath) {
      throw new Error("Root path is not set");
    }

    const paths: string[] = await invoke("list_files_recursively", {
      path: rootPath,
    });

    const fileSystem = new VirtualFileSystem(paths);

    await fileSystem.setupFiles();

    return fileSystem;
  }

  public static async loadAssets(path: string) {
    const projectFiles = await AssetDatabase.loadProjectFiles(path);

    console.log("Loaded project files:", projectFiles);

    for (const path of projectFiles) {
      const assetType = guessAssetTypeFromPath(path);

      if (assetType === AssetType.Unknown) {
        continue;
      }

      const asset = new Asset({ path, assetType });

      AssetDatabase.assets.push(asset);
    }

    return AssetDatabase.assets;
  }

  private static async loadProjectFiles(path: string): Promise<string[]> {
    try {
      const paths: string[] = await invoke("list_files_recursively", { path });

      return paths;
    } catch (error) {
      console.error("Failed to load files recursively:", error);
      return [];
    }
  }
}
