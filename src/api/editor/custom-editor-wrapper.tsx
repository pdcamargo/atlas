import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@ebay/nice-modal-react";
import { observer } from "mobx-react-lite";

export type RegisterDialogOptions = {
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
};

export const CustomEditorWrapper: React.FC<
  RegisterDialogOptions & {
    title: string;
    children: React.ReactNode;
  }
> = observer(({ children, title, ...rest }) => {
  const modal = useModal();

  return (
    <Dialog
      open={modal.visible}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          modal.show();
        } else {
          modal.hide();
        }
      }}
    >
      <DialogContent
        className="sm:rounded-t-[4px] gap-0 p-0 shadow-lg frosted-glass text-sm"
        withOverlay={false}
        style={{
          ...rest,
        }}
      >
        <DialogHeader className="sm:rounded-t-[4px] bg-nosferatu flex justify-center">
          <DialogTitle className="text-base font-semibold m-0 px-2">
            {title}
          </DialogTitle>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
});
