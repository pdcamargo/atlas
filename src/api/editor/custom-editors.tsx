import { makeAutoObservable } from "mobx";
import { EditorMenu } from ".";
import { observer } from "mobx-react-lite";

import NiceModal from "@ebay/nice-modal-react";
import { CustomEditorWrapper } from "./custom-editor-wrapper";

export type RegisterDialogOptions = {
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
};

export const CustomEditors = new (class CustomEditors {
  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });

    this.registerEditor("edit/Project Settings", () => {
      return (
        <div className="flex flex-1 w-full">
          <div className="w-[200px] frosted-glass backdrop-blur-sm bg-nosferatu-400/50 h-[500px]">
            test
          </div>

          <div className="flex-1 bg-nosferatu h-[500px]">
            <div className="flex-1 bg-black/30 h-[500px]">test</div>
          </div>
        </div>
      );
    });
  }

  public registerEditor(
    path: string,
    TargetDialog: React.FC,
    options: RegisterDialogOptions = {}
  ) {
    const title = path.split("/").pop()!;

    // to Title Case
    const pathToLabel = (part: string) => {
      return part
        .replace(/_/g, " ")
        .split("/")
        .map((word) => word[0].toUpperCase() + word.substring(1))
        .join(" ");
    };

    const TheComponent = observer(() => (
      <CustomEditorWrapper {...options} title={pathToLabel(title)}>
        <TargetDialog />
      </CustomEditorWrapper>
    ));

    const NewModal = NiceModal.create(TheComponent);

    EditorMenu.registerAction(path, () => {
      NiceModal.show(NewModal);
    });
  }
})();
