import { observer } from "mobx-react-lite";

import { TreeNode, TreeView } from "@/components/ui/tree-view";
import { Circle } from "lucide-react";
import { IGameObject } from "@atlas/engine";

import { SceneManager, Selection } from "@atlas/editor";

const EXPANDED_LOCAL_STORAGE_KEY = "scene_defaultExpandedIds";
const SELECTED_LOCAL_STORAGE_KEY = "scene_defaultSelectedIds";

const getIcon = (gameObject: IGameObject) => {
  return <Circle />;
};

// Function to recursively build the tree structure from IGameObject
function buildGameObjectTree(gameObjects: IGameObject[]): TreeNode[] {
  return gameObjects.map((gameObject) => ({
    id: gameObject.id,
    label: {
      text: gameObject.name,
      icon: getIcon(gameObject),
    },
    children: buildGameObjectTree(gameObject.children),
  }));
}

// Assuming a top-level function or component that kicks off the tree-building
function createGameObjectTree(rootGameObjects: IGameObject[]): TreeNode[] {
  // Directly start with the root game objects
  return buildGameObjectTree(rootGameObjects);
}

export const Hierarchy = observer(() => {
  const nodes = createGameObjectTree(
    SceneManager.currentScene?.gameObjects || []
  );

  return (
    <TreeView
      defaultExpandedIds={
        new Set(
          JSON.parse(localStorage.getItem(EXPANDED_LOCAL_STORAGE_KEY) || "[]")
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
          JSON.parse(localStorage.getItem(SELECTED_LOCAL_STORAGE_KEY) || "[]")
        )
      }
      onSelectIdsChange={(selectedIds) => {
        localStorage.setItem(
          SELECTED_LOCAL_STORAGE_KEY,
          JSON.stringify(Array.from(selectedIds))
        );

        const [id] = Array.from(selectedIds);
        const go = SceneManager.currentScene?.scene.findGameObjectById(id);

        if (go) {
          Selection.select(go);
        }
      }}
      nodes={nodes}
    />
  );
});
