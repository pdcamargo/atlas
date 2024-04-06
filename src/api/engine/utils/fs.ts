import * as tauriFs from "@tauri-apps/api/fs";
import { path } from "./path";

async function readJson<T>(path: string): Promise<T> {
  const content = await tauriFs.readTextFile(path);

  return JSON.parse(content);
}

async function writeJson<T>(path: string, data: T): Promise<void> {
  await tauriFs.writeTextFile(
    path,
    typeof data !== "string" ? JSON.stringify(data, null, 2) : data
  );
}

async function ensureDir(targetPath: string): Promise<void> {
  const extension = await path.extname(targetPath);

  if (extension) {
    targetPath = await path.dirname(targetPath);
  }

  await tauriFs.createDir(targetPath, { recursive: true });
}

async function isDir(targetPath: string): Promise<boolean> {
  try {
    const extensionName = await path.extname(targetPath);

    return !extensionName;
  } catch {
    return true;
  }
}

async function exists(targetPath: string): Promise<boolean> {
  try {
    return await tauriFs.exists(targetPath);
  } catch {
    return false;
  }
}

export const fs = {
  ...tauriFs,
  readJson,
  writeJson,
  ensureDir,
  isDir,
  exists,
};
