import { makeAutoObservable } from "mobx";

export const Selection = new (class Selection {
  public selected: any | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  public select(item: any) {
    this.selected = item;
  }

  public clearSelection() {
    this.selected = null;
  }

  public isSelection<T>(klazz: new (...args: any[]) => T): boolean {
    return this.selected !== null && this.selected instanceof klazz;
  }
})();
