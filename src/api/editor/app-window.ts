import { appWindow } from "@tauri-apps/api/window";

export class AppWindow {
  /**
   * Returns whether the window is currently maximized after the operation.
   */
  static async maximize() {
    if (!(await appWindow.isMaximized())) {
      await appWindow.maximize();
    }

    return await appWindow.isMaximized();
  }

  /**
   * Returns whether the window is currently minimized after the operation.
   */
  static async minimize() {
    if (!(await appWindow.isMinimized())) {
      await appWindow.minimize();
    }

    return await appWindow.isMinimized();
  }

  /**
   * Returns whether the window is currently unmaximized after the operation.
   */
  static async unmaximize() {
    if (await appWindow.isMaximized()) {
      await appWindow.unmaximize();
    }

    return await appWindow.isMaximized();
  }

  static async close() {
    await appWindow.close();
  }
}
