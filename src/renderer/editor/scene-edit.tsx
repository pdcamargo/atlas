import * as Editor from "@atlas/editor";
import { Scene, Serialization } from "@atlas/engine";
import { useLayoutEffect, useRef } from "react";

import * as PIXI from "pixi.js";

import { observer } from "mobx-react-lite";

const renderer = new PIXI.WebGLRenderer();

renderer.init({
  width: 800,
  height: 600,
  backgroundColor: 0x000000,
});

const scene = new Scene({
  name: "New Scene",
});

scene.createGameObject({
  name: "New GameObject 1",
  components: [],
  children: [],
});

scene.createGameObject({
  name: "New GameObject 2",
  components: [],
  children: [],
});

scene.createGameObject({
  name: "New GameObject 3",
  components: [],
  children: [],
});

scene.createGameObject({
  name: "New GameObject 4",
  components: [],
  children: [],
});

Editor.SceneManager.setCurrentScene(new Editor.EditorScene(scene));

export const SceneEdit = observer(() => {
  const project = Editor.Project.getCurrent()!;

  useLayoutEffect(() => {
    const holder = document.getElementById("holder")!;

    renderer.resize(holder.clientWidth, holder.clientHeight);

    holder.appendChild(renderer.canvas);

    const ser = Serialization.serialize(scene);
    const des = Serialization.deserialize(ser, Scene);

    console.log({
      ser: typeof ser === "string" ? JSON.parse(ser) : ser,
      des,
    });
  }, []);

  return <div id="holder" className="w-full h-full" />;
});
