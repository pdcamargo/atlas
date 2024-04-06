import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorHeader } from "./header";
import { Hierarchy } from "../hierarchy";
import { FileSystem } from "../file-system";
import { SceneEdit } from "../scene-edit";
import { Inspector } from "../inspector";
import { useEffect } from "react";
import { ShortcutManager, Undo } from "@atlas/editor";

export const EditorClient = () => {
  useEffect(() => {
    ShortcutManager.on("undo", () => {
      Undo.undo();
    });

    ShortcutManager.on("redo", () => {
      Undo.redo();
    });
  }, []);

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden justify-start items-start">
      <EditorHeader />

      <div className="panel">
        <div className="panel flex-col">
          <div className="panel">
            <Tabs defaultValue="hierarchy" className="max-w-[20vw]">
              <TabsList>
                <TabsTrigger value="hierarchy">Hierarchy</TabsTrigger>
              </TabsList>
              <TabsContent value="hierarchy">
                <div className="panel-content">
                  <Hierarchy />
                </div>
              </TabsContent>
            </Tabs>
            <Tabs defaultValue="scene-edit">
              <TabsList>
                <TabsTrigger value="scene-edit">Edit Scene</TabsTrigger>
              </TabsList>
              <TabsContent value="scene-edit">
                <SceneEdit />
              </TabsContent>
            </Tabs>
          </div>
          <div className="panel max-h-[300px]">
            <Tabs defaultValue="file-system">
              <TabsList>
                <TabsTrigger value="file-system">File System</TabsTrigger>
              </TabsList>
              <TabsContent value="file-system">
                <div className="panel-content">
                  <FileSystem />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="panel max-w-[20vw]">
          <Tabs defaultValue="inspector">
            <TabsList>
              <TabsTrigger value="inspector">Inspector</TabsTrigger>
            </TabsList>
            <TabsContent value="inspector">
              <Inspector />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
