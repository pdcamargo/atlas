import { open } from "@tauri-apps/api/dialog";

type OpenDirectoryOptions = {
  title?: string;
  multiple?: boolean;
  recursive?: boolean;
};

export class Dialog {
  static async openDirectory({
    title,
    multiple,
    recursive,
  }: OpenDirectoryOptions): Promise<string | string[] | null> {
    const result = await open({
      directory: true,
      recursive,
      multiple,
      title,
    });

    if (result === undefined) {
      return null;
    }

    return result;
  }
}
