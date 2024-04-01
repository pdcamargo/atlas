import { dirname, resolve } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/api/shell";

export class Shell {
  public static async showInExplorer(filePath: string) {
    await open(await dirname(filePath));
  }

  public static async openFile(filePath: string) {
    await open(await resolve(filePath));
  }
}
