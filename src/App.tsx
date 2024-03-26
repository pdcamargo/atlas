import { ProjectSelector } from "@/editor/project-selector";
import { AppWindow, Project } from "./api/editor";
import { useState } from "react";
import { EditorLayout } from "@/editor/editor-layout";

function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (selectedProject !== null) {
    return <EditorLayout />;
  }

  return (
    <ProjectSelector
      onProjectSelect={(project) => {
        setSelectedProject(project);

        AppWindow.maximize();
      }}
    />
  );
}

export default App;
