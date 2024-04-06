import { TreeNode } from "@/components/ui/tree-view";
import { AssetType, FileDescriptor, Project } from "@atlas/editor";
import { Folder, Music, ShieldQuestion } from "lucide-react";
import { makeAutoObservable } from "mobx";

export const EXPANDED_LOCAL_STORAGE_KEY = "fileSystem_defaultExpandedIds";
export const SELECTED_LOCAL_STORAGE_KEY = "fileSystem_defaultSelectedIds";

export const FileSystemStore = new (class FileSystemStore {
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

    this.selectById(
      JSON.parse(localStorage.getItem(SELECTED_LOCAL_STORAGE_KEY) || "[]")[0] ||
        "root"
    );
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
