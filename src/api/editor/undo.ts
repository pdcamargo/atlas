import { makeAutoObservable } from "mobx";
import { ComponentConstructor, IComponent, IGameObject } from "../engine";
import { SerializedObject } from ".";

type UndoableAction = {
  undo: () => void;
  redo: () => void;
};

export const Undo = new (class Undo {
  private stack: UndoableAction[] = [];
  private index = -1;

  constructor() {
    makeAutoObservable(this);
  }

  public get canUndo() {
    return this.index > 0;
  }

  public get canRedo() {
    return this.index < this.stack.length - 1;
  }

  public undo() {
    if (this.canUndo) {
      this.index -= 1;
      this.stack[this.index].undo();
    }
  }

  public redo() {
    if (this.canRedo) {
      this.stack[this.index].redo();
      this.index += 1;
    }
  }

  public add(undoable: UndoableAction) {
    if (this.index < this.stack.length - 1) {
      this.stack.splice(this.index + 1);
    }
    this.stack.push(undoable);
    this.index += 1;
  }

  public addComponent<T extends IComponent>(
    gameObject: IGameObject | SerializedObject<IGameObject>,
    component: ComponentConstructor<T>
  ) {
    const redo = () => {
      if (gameObject instanceof SerializedObject) {
        const componentsArray = gameObject.findProperty("components");

        componentsArray.arrayValue = [
          ...componentsArray.arrayValue,
          new component({ gameObject: gameObject.targetObject }),
        ];

        gameObject.applyModifiedProperties();
      } else {
        const c = gameObject.addComponent(component);

        c.onEnable();
      }
    };

    const undo = () => {
      if (gameObject instanceof SerializedObject) {
        const componentsArray = gameObject.findProperty("components");

        componentsArray.arrayValue = componentsArray.arrayValue.filter(
          (c) => !(c instanceof component)
        );

        gameObject.applyModifiedProperties();
      } else {
        gameObject.removeComponent(component);
      }
    };

    this.add({ undo, redo });

    redo();
  }
})();
