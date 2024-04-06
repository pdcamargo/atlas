import * as Editor from "@atlas/editor";
import { Scene, Serialization } from "@atlas/engine";
import { useEffect } from "react";

import { AspectRatio } from "@/components/ui/aspect-ratio";

import { observer } from "mobx-react-lite";
import { Droppable } from "@/components/ui/droppable";
import { DraggableTypes } from "@/components/ui/draggable";

// const scene = new Scene({
//   name: "New Scene",
// });

// scene.createGameObject({
//   name: "New GameObject 1",
//   components: [],
//   children: [],
// });

// scene.createGameObject({
//   name: "New GameObject 2",
//   components: [],
//   children: [
//     scene.createGameObject({
//       name: "New GameObject 3",
//       components: [],
//       children: [
//         scene.createGameObject({
//           name: "New GameObject 5",
//           components: [],
//           children: [
//             scene.createGameObject({
//               name: "New GameObject 6",
//               components: [],
//               children: [
//                 scene.createGameObject({
//                   name: "New GameObject 7",
//                   components: [],
//                   children: [],
//                 }),
//               ],
//             }),
//           ],
//         }),
//       ],
//     }),
//   ],
// });

// scene.createGameObject({
//   name: "New GameObject 4",
//   components: [],
//   children: [],
// });

// Editor.SceneManager.setCurrentScene(new Editor.EditorScene(scene));

export const SceneEdit = observer(() => {
  const project = Editor.Project.getCurrent()!;

  useEffect(() => {
    const holder = document.getElementById("holder")!;

    Editor.EditorRenderer.resize(holder.clientWidth, holder.clientHeight);

    holder.innerHTML = "";

    holder.appendChild(Editor.EditorRenderer.canvas);

    const bg = new Editor.BackgroundSystem();

    bg.color = 0xff0000;

    Editor.EditorRenderer.background = bg;

    // Editor.EditorRenderer.render(scene.sceneContainer!);

    // const ser = Serialization.serialize(scene);
    // const des = Serialization.deserialize(ser, Scene);

    let id = 0;
    // loop rendering
    const loop = () => {
      if (Editor.SceneManager.currentScene) {
        Editor.EditorRenderer.render(
          Editor.SceneManager.currentScene.scene.sceneContainer!
        );
      }

      id = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(id);
    };
  }, []);

  return (
    <Droppable asChild canDrop={() => true} accept={DraggableTypes.ASSET}>
      {({ isOver, canDrop }) => (
        <div className="w-full h-full flex items-center justify-center bg-black">
          <AspectRatio ratio={16 / 9}>
            <div
              id="holder"
              className="w-full h-full shadow-lg"
              style={{
                opacity: isOver ? 0.5 : 1,
                outline: canDrop ? "2px dotted #ffffff" : "none",
              }}
            />
          </AspectRatio>
        </div>
      )}
    </Droppable>
  );
});
