import { ProjectSelector } from "@/editor/project-selector";
import { AppWindow, Project } from "./api/editor";
import { useState } from "react";
import { EditorClient } from "@/editor/editor-client";

function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (selectedProject !== null) {
    return <EditorClient />;
  }

  return (
    <ProjectSelector
      onProjectSelect={(project) => {
        Project.setCurrent(project).then(() => {
          setSelectedProject(project);
          // AppWindow.maximize();
        });
      }}
    />
  );
}

export default App;
