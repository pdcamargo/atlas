import { makeAutoObservable } from "mobx";

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
})();
