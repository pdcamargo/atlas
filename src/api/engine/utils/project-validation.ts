import { resolve } from "./path";
import { exists } from "./fs";

export async function isPathProject(path: string): Promise<boolean> {
  const requiredFolders = ["assets", "metadata", "src", "configs"];
  const requiredFiles = ["project.atlas"];

  const folderExists = await exists(path);

  if (!folderExists) {
    return false;
  }

  const promises = requiredFolders.map(async (folder) =>
    exists(await resolve(path, folder))
  );

  const foldersExist = await Promise.all(promises);

  if (!foldersExist.every((exists) => exists)) {
    return false;
  }

  const promisesFiles = requiredFiles.map(async (file) =>
    exists(await resolve(path, file))
  );

  const filesExist = await Promise.all(promisesFiles);

  return filesExist.every((exists) => exists);
}

type ProjectConfig = {
  name: string;
  version: string;
};

export async function isProjectConfigValid(
  config: Record<string, any>
): Promise<boolean> {
  const projectConfig = config as ProjectConfig;

  if (!projectConfig.name || !projectConfig.version) {
    return false;
  }

  return true;
}
