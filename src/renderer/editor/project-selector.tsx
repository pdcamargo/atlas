import { Project } from "@atlas/editor/project";
import { useEffect, useState } from "react";
import { ProjectCreateForm } from "./project-create-form";

export const ProjectSelector = () => {
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

            <ProjectCreateForm />
          </div>
        )}
      </div>
    </div>
  );
};
