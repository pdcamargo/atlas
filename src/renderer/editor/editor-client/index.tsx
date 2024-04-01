import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorHeader } from "./header";
import { Hierarchy } from "../hierarchy";
import { FileSystem } from "../file-system";
import { SceneEdit } from "../scene-edit";
import { Inspector } from "../inspector";

export const EditorClient = () => {
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden justify-start items-start">
      <EditorHeader />

      <div className="panel-container">
        <div className="panel-container flex-col px-0">
          <div className="panel-container">
            <Tabs defaultValue="scene" className="max-w-[20vw]">
              <TabsList>
                <TabsTrigger value="scene">Scene</TabsTrigger>
                <TabsTrigger value="import">Import</TabsTrigger>
              </TabsList>
              <TabsContent value="scene">
                <div className="panel-content">
                  <Hierarchy />
                </div>
              </TabsContent>
              <TabsContent value="import">
                Make changes to your import here.
              </TabsContent>
            </Tabs>
            <Tabs defaultValue="scene-edit">
              <TabsList>
                <TabsTrigger value="scene-edit">Scene</TabsTrigger>
              </TabsList>
              <TabsContent value="scene-edit">
                <SceneEdit />
              </TabsContent>
            </Tabs>
          </div>
          <div className="panel-container py-0 max-h-[300px]">
            <Tabs defaultValue="file-system">
              <TabsList>
                <TabsTrigger value="file-system">File System</TabsTrigger>
                <TabsTrigger value="import">Import</TabsTrigger>
              </TabsList>
              <TabsContent value="file-system">
                <div className="panel-content">
                  <FileSystem />
                </div>
              </TabsContent>
              <TabsContent value="import">
                Make changes to your import here.
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="panel-container max-w-[20vw]">
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
