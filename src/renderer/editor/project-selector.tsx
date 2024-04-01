import { Project, SavedProject } from "@atlas/editor/project";
import { useEffect, useState } from "react";
import { ProjectCreateForm } from "./project-create-form";
import { Button } from "@/components/ui/button";

type ProjectSelectorProps = {
  onProjectSelect: (project: Project) => void;
};

export const ProjectSelector = ({ onProjectSelect }: ProjectSelectorProps) => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      const projects = await Project.getProjectsList();

      setProjects(projects);
    };

    loadProjects();
  }, []);

  return (
    <div className="w-full flex-1 h-full flex flex-col justify-start items-start bg-slate-900">
      <div className="w-full h-16 flex justify-between items-center px-4 bg-slate-800">
        <div className="text-white">Projects</div>
        <div className="flex justify-end items-center">
          <button className="btn btn-primary">New Project</button>
        </div>
      </div>
      <div className="w-full h-full flex justify-center items-center">
        {projects.length === 0 && (
          <div>
            <div className="text-white">No projects found</div>

            <ProjectCreateForm
              onProjectCreate={(project) => {
                onProjectSelect(
                  new Project({
                    name: project.name,
                    path: project.path,
                  })
                );
              }}
            />
          </div>
        )}
        {projects?.map((project) => (
          <div
            key={project.path}
            className="bg-slate-700 m-4 flex items-center flex-1 w-full"
          >
            <div className="text-white">{project.name}</div>
            <Button size="sm" onClick={() => onProjectSelect(project)}>
              Open
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
