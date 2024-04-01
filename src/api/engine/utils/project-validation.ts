import { path } from "./path";
import { fs } from "./fs";

async function isPathProject(targetPath: string): Promise<boolean> {
  const requiredFolders = ["assets", "metadata", "src", "configs"];
  const requiredFiles = ["project.atlas"];

  const folderExists = await fs.exists(targetPath);

  if (!folderExists) {
    return false;
  }

  const promises = requiredFolders.map(async (folder) =>
    fs.exists(await path.resolve(targetPath, folder))
  );

  const foldersExist = await Promise.all(promises);

  if (!foldersExist.every((exists) => exists)) {
    return false;
  }

  const promisesFiles = requiredFiles.map(async (file) =>
    fs.exists(await path.resolve(targetPath, file))
  );

  const filesExist = await Promise.all(promisesFiles);

  return filesExist.every((exists) => exists);
}

type ProjectConfig = {
  name: string;
  version: string;
};

async function isProjectConfigValid(
  config: Record<string, any>
): Promise<boolean> {
  const projectConfig = config as ProjectConfig;

  if (!projectConfig.name || !projectConfig.version) {
    return false;
  }

  return true;
}

export const projectValidation = {
  isPathProject,
  isProjectConfigValid,
};
