import { readTextFile, writeTextFile } from "@tauri-apps/api/fs";

export * from "@tauri-apps/api/fs";

export async function readJson<T>(path: string): Promise<T> {
  const content = await readTextFile(path);

  return JSON.parse(content);
}

export async function writeJson<T>(path: string, data: T): Promise<void> {
  await writeTextFile(path, JSON.stringify(data));
}
