import { readJson } from "@atlas/engine/utils/fs";
import * as path from "@atlas/engine/utils/path";
import * as fs from "@atlas/engine/utils/fs";
import {
  isPathProject,
  isProjectConfigValid,
} from "@atlas/engine/utils/project-validation";

type ProjectOptions = {
  path: string;
  name: string;
};

type ProjectConfig = Omit<ProjectOptions, "path">;

const requiredFolders = ["assets", "metadata", "src", "configs"];

export type SavedProject = ProjectOptions & {
  lastModified: number;
  lastOpened: number;
};

export class Project {
  path: string;
  name: string;

  private static currentProject: Project | null = null;

  constructor({ path, name }: ProjectOptions) {
    this.path = path;
    this.name = name;
  }

  static getCurrent() {
    return Project.currentProject;
  }

  static setCurrent(project: Project) {
    Project.currentProject = project;
  }

  static async createProject({
    name,
    path: targetPath,
  }: ProjectOptions): Promise<{
    project: Project | null;
    error: string | null;
  }> {
    const isPathTaken = await fs.exists(targetPath);

    if (isPathTaken) {
      return {
        project: null,
        error: "Path already exists.",
      };
    }

    const project = new Project({ path: targetPath, name });

    await fs.createDir(targetPath, { recursive: true });

    await fs.writeJson(await path.join(targetPath, "project.atlas"), {
      name,
    });

    for (const folder of requiredFolders) {
      await fs.createDir(await path.join(targetPath, folder), {
        recursive: true,
      });
    }

    await Project.saveToCache(project);
    await Project.saveToProjectsList(project);

    return {
      project,
      error: null,
    };
  }

  static async openProject(targetPath: string): Promise<Project | null> {
    const project = await Project.fromPath(targetPath);

    console.log("found project", project);

    if (!project) {
      return null;
    }

    await Project.saveToCache(project);
    await Project.saveToProjectsList(project);

    return project;
  }

  static async fromPath(targetPath: string): Promise<Project | null> {
    if (!(await isPathProject(targetPath))) {
      return null;
    }

    const projectJson = await readJson<ProjectConfig>(
      await path.join(targetPath, "project.atlas")
    );

    if (!(await isProjectConfigValid(projectJson))) {
      return null;
    }

    return new Project({
      path: targetPath,
      name: projectJson.name,
    });
  }

  /**
   * Returns the project from the cache.
   */
  static async fromCache(): Promise<Project | null> {
    const appCacheDir = await path.appCacheDir();
    const cachePath = await path.join(appCacheDir, "project.atlas");

    const json = await readJson<ProjectOptions>(cachePath);

    return Project.fromPath(json.path);
  }

  /**
   * This is the cache path for the current open project.
   */
  static async saveToCache(project: Project) {
    const appCacheDir = await path.appCacheDir();
    const cachePath = await path.join(appCacheDir, "project.atlas");

    // ensure the cache directory exists
    await fs.createDir(appCacheDir, { recursive: true });

    await fs.writeJson(cachePath, {
      path: project.path,
      name: project.name,
    });
  }

  /**
   * Add to the list of created project for reference during the project selection.
   */
  static async saveToProjectsList(project: Project) {
    const appCacheDir = await path.appCacheDir();
    const projectsListPath = await path.join(appCacheDir, "projects.atlas");

    // ensure the cache directory exists
    await fs.createDir(appCacheDir, { recursive: true });

    let projectsList: SavedProject[] = [];

    try {
      projectsList = await readJson<SavedProject[]>(projectsListPath);
    } catch {
      // create the file if it doesn't exist
      await fs.writeJson(projectsListPath, projectsList);
    }

    // check if the project is already in the list
    const projectIndex = projectsList.findIndex((p) => p.path === project.path);

    if (projectIndex === -1) {
      projectsList.push({
        path: project.path,
        name: project.name,
        lastModified: Date.now(),
        lastOpened: Date.now(),
      });

      await fs.writeJson(projectsListPath, projectsList);
    }

    return projectsList;
  }

  static async getProjectsList(): Promise<SavedProject[]> {
    const appCacheDir = await path.appCacheDir();
    const projectsListPath = await path.join(appCacheDir, "projects.atlas");

    try {
      return await readJson<SavedProject[]>(projectsListPath);
    } catch {
      return [];
    }
  }
}
