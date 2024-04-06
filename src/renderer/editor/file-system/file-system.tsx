import { Button } from "@/components/ui/button";
import { TreeNode, TreeView } from "@/components/ui/tree-view";
import { FileDescriptor, Project, SceneManager, Shell } from "@atlas/editor";
import { Folder, Image, RefreshCw } from "lucide-react";
import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";

import { useEffect } from "react";
import { Thumbnail } from "./thumbnail";
import {
  FileSystemStore,
  EXPANDED_LOCAL_STORAGE_KEY,
  SELECTED_LOCAL_STORAGE_KEY,
} from "./utils";
import { SimpleTooltip } from "@/components/ui/tooltip";

export const FileSystem = observer(() => {
  useEffect(() => {
    setTimeout(() => {
      FileSystemStore.updateNodes();
    }, 10);
  }, []);

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex items-center w-full h-6 bg-black/30">
        <SimpleTooltip content="Refresh File System">
          <Button
            className="p-0 m-0 px-1 h-6 ml-auto rounded-none bg-black/40 hover:bg-dracula-purple-500"
            variant="secondary"
            onClick={() => {
              FileSystemStore.updateNodes();
            }}
          >
            <RefreshCw className="w-4" />
          </Button>
        </SimpleTooltip>
      </div>

      <div className="flex flex-1 h-full">
        <div className="flex-1 h-full overflow-hidden border-r border-black/30 max-w-[20%] pt-1">
          <TreeView<FileDescriptor>
            className="h-[inherit] flex-1"
            getContextMenu={(node: TreeNode<FileDescriptor>) => {
              return [
                {
                  id: "new-folder",
                  label: "New Folder",
                  icon: <Folder />,
                  shortcut: "Ctrl + N",
                  onClick: () => {},
                },
                {
                  id: "new-scene",
                  label: "New Scene",
                  icon: <Image />,
                  shortcut: "Ctrl + Shift + N",
                  onClick: async () => {
                    await SceneManager.newScene("New Scene", node.id);

                    runInAction(() => {
                      FileSystemStore.updateNodes();
                    });
                  },
                },
                {
                  type: "separator",
                },
                {
                  id: "show-in-explorer",
                  label: "Show in Explorer",
                  icon: <Folder />,
                  onClick: () => {
                    Shell.showInExplorer(
                      node.id === "root"
                        ? `${Project.getCurrent()?.path}/src`
                        : node.id
                    );
                  },
                },
              ];
            }}
            defaultExpandedIds={
              new Set(
                JSON.parse(
                  localStorage.getItem(EXPANDED_LOCAL_STORAGE_KEY) || "[]"
                )
              )
            }
            onExpandesIdsChange={(expandedIds) => {
              localStorage.setItem(
                EXPANDED_LOCAL_STORAGE_KEY,
                JSON.stringify(Array.from(expandedIds))
              );
            }}
            defaultSelectedIds={
              new Set(
                JSON.parse(
                  localStorage.getItem(SELECTED_LOCAL_STORAGE_KEY) || "[]"
                )
              )
            }
            onSelectIdsChange={(selectedIds) => {
              localStorage.setItem(
                SELECTED_LOCAL_STORAGE_KEY,
                JSON.stringify(Array.from(selectedIds))
              );
              FileSystemStore.selectById(Array.from(selectedIds)[0]);
            }}
            nodes={FileSystemStore.nodes}
          />
        </div>

        <div className="flex-1 w-full h-full flex gap-2 p-2 overflow-hidden">
          {FileSystemStore.selectedNodeData?.children?.map((child) => (
            <Thumbnail key={child.id} file={child} />
          ))}
        </div>
      </div>
    </div>
  );
});
