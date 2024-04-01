import { makeAutoObservable } from "mobx";
import { AppWindow } from ".";

type EditorAction = () => void;

export interface IMenuNode {
  id: string;
  label: string;
  children: IMenuNode[];
  action?: EditorAction; // Actions are optional and only leaf nodes should have actions
}

function newProject() {}
function quit() {
  AppWindow.close();
}

export const EditorMenu = new (class EditorMenu {
  private menuMap: Map<string, IMenuNode> = new Map();

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });

    this.registerAction("file/New Project", newProject);
    this.registerAction("file/Quit", quit);
  }

  registerAction(path: string, action: EditorAction) {
    const parts = path.split("/");
    const actionLabel = parts.pop()!;
    const fullPath = parts.join("/");

    const pathPartToLabel = (part: string) => {
      return part
        .replace(/_/g, " ")
        .split("/")
        .map((word) => word[0].toUpperCase() + word.substring(1))
        .join(" ");
    };

    let parentNode: IMenuNode | undefined;

    parts.reduce((currentPath, part) => {
      const id = (currentPath ? currentPath + "/" : "") + part;
      const label = pathPartToLabel(part);

      if (!this.menuMap.has(id)) {
        const newNode: IMenuNode = { id, label, children: [] };
        this.menuMap.set(id, newNode);

        // If parentNode is defined, add newNode as a child
        if (parentNode) {
          parentNode.children.push(newNode);
        }
      }

      parentNode = this.menuMap.get(id);
      return id;
    }, "");

    // Add the action node
    if (parentNode && actionLabel) {
      const actionId = fullPath + "/" + actionLabel;
      const actionNode: IMenuNode = {
        id: actionId,
        label: pathPartToLabel(actionLabel),
        children: [], // Actions don't have children, but keeping the structure consistent
        action: action,
      };
      parentNode.children.push(actionNode);
      this.menuMap.set(actionId, actionNode);
    }
  }

  public get menus(): IMenuNode[] {
    // Extract the top-level nodes, those without a "/" in their id (meaning they are the root nodes)
    const topLevelNodes: IMenuNode[] = Array.from(this.menuMap.values()).filter(
      (node) => !node.id.includes("/")
    );
    return topLevelNodes;
  }
})();
