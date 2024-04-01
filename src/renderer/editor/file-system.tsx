import { TreeNode, TreeView } from "@/components/ui/tree-view";
import {
  FileDescriptor,
  Project,
  SceneManager,
  SerializedProperty,
  Shell,
} from "@atlas/editor";
import { AssetType } from "@atlas/editor";
import { Folder, Image, Music, ShieldQuestion } from "lucide-react";
import { makeAutoObservable, runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useLayoutEffect } from "react";

// Helper function to find children for a given node
function findChildren(
  nodes: FileDescriptor[],
  parentId: string | null
): TreeNode[] {
  const getIcon = (node: FileDescriptor) => {
    if (node.isDirectory) {
      return <Folder className="text-dracula-purple-600" />;
    }

    switch (node.assetType) {
      case AssetType.Audio:
        return <Music />;
      case AssetType.Texture:
        return (
          <div
            className="w-[16px] h-[16px]"
            style={{
              backgroundSize: "cover",
              backgroundImage: `url(${node.assetPath})`,
            }}
          ></div>
        );
      default:
        return <ShieldQuestion />;
    }
  };

  return nodes
    .filter((node) => node.parentId === parentId)
    .map((node) => ({
      id: node.id,
      label: {
        text: node.name,
        icon: getIcon(node),
      },
      children: findChildren(nodes, node.id),
      data: node,
    }));
}

// Main function to build the tree structure
function buildTree(files: FileDescriptor[]): TreeNode[] {
  // Filter out the root level nodes and start building the tree from there
  return [
    {
      id: "root",
      label: {
        text: "Root",
        icon: <Folder className="text-dracula-purple-600" />,
      },
      children: findChildren(files, null),
    },
  ];
}

const EXPANDED_LOCAL_STORAGE_KEY = "fileSystem_defaultExpandedIds";
const SELECTED_LOCAL_STORAGE_KEY = "fileSystem_defaultSelectedIds";

const FileSystemStore = new (class FileSystemStore {
  public nodes: TreeNode[] = [];

  public selectedNode: TreeNode | null = null;

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });

    this.updateNodes();
  }

  public updateNodes() {
    this.nodes = buildTree(
      Project.getCurrent()?.fileSystem?.files.filter((f) => f.isDirectory) ?? []
    );

    console.log({
      pDir: Project.getCurrent()?.fileSystem?.files.filter(
        (f) => f.isDirectory
      ),
      p: Project.getCurrent()?.fileSystem?.files,
    });
  }

  public selectById(id: string) {
    const recursiveFind = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        if (node.id === id) {
          this.selectedNode = node;
          return;
        }

        if (node.children) {
          recursiveFind(node.children);
        }
      }
    };

    recursiveFind(this.nodes);

    console.log({ selectedNode: this.selectedNode });
  }

  public get selectedNodeData() {
    const data = this.selectedNode?.data as FileDescriptor;

    if (!data) {
      return null;
    }

    const children = Project.getCurrent()?.fileSystem?.files.filter(
      (f) => f.parentId === data.id
    );

    return {
      ...data,
      children,
    };
  }
})();

export const FileSystem = observer(() => {
  useLayoutEffect(() => {
    FileSystemStore.updateNodes();
  }, []);

  return (
    <div className="flex flex-1 h-full">
      <div className="flex-1 h-full overflow-hidden border-r border-black/30 max-w-[20%]">
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

      <div className="flex-1 w-full h-full overflow-hidden">
        {FileSystemStore.selectedNodeData?.children?.map((child) => (
          <div key={child.id}>
            <div>{child.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
});
