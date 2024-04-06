import * as tauriPath from "@tauri-apps/api/path";

export async function extname(targetPath: string): Promise<string | null> {
  try {
    return await tauriPath.extname(targetPath);
  } catch {
    return null;
  }
}

export const path = {
  ...tauriPath,
  extname,
};
