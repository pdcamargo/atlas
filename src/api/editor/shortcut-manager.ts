import { makeAutoObservable } from "mobx";

type EventMap = {
  undo: () => void;
  redo: () => void;
  save: () => void;
  copy: () => void;
  cut: () => void;
  paste: () => void;
  enter: () => void;
};

export const ShortcutManager = new (class ShortcutManager {
  private _events: Partial<{
    [K in keyof EventMap]: Array<EventMap[K]>;
  }> = {};

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });

    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "z":
            this.emit("undo");
            break;
          case "y":
            this.emit("redo");
            break;
          case "s":
            this.emit("save");
            break;
          case "c":
            this.emit("copy");
            break;
          case "x":
            this.emit("cut");
            break;
          case "v":
            this.emit("paste");
            break;
        }

        return;
      }

      switch (e.key) {
        case "Enter":
          this.emit("enter");
          break;
      }
    });
  }

  public on<K extends keyof EventMap>(event: K, callback: EventMap[K]) {
    if (!this._events[event]) {
      this._events[event] = [];
    }

    if (this._events[event]?.includes(callback)) {
      return () => {
        this.off(event);
      };
    }

    this._events[event]?.push(callback);

    return () => {
      this.off(event);
    };
  }

  public off<K extends keyof EventMap>(event: K) {
    delete this._events[event];
  }

  private emit<K extends keyof EventMap>(event: K) {
    const callbacks = this._events[event];

    if (!callbacks) {
      return;
    }

    for (const callback of callbacks) {
      callback();
    }
  }
})();
