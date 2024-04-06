import { SimpleContextMenuItem } from "@/components/ui/context-menu";
import { Asset, AssetType } from "@atlas/editor";
import { ExternalLink, FolderPen, Trash2 } from "lucide-react";

export function getThumbnailContextMenu(asset: Asset): SimpleContextMenuItem[] {
  const commonItems: SimpleContextMenuItem[] = [
    {
      id: "rename",
      label: "Rename",
      shortcut: "E",
      icon: <FolderPen />,
      onClick: () => {
        console.log("Rename");
      },
    },
    {
      id: "Delete",
      label: "Delete",
      shortcut: "Delete",
      icon: <Trash2 />,
      onClick: () => {
        console.log("Delete");
      },
    },
  ];

  switch (asset.assetType) {
    case AssetType.Scene:
      return [
        {
          id: "open",
          label: "Open",
          shortcut: "Enter",
          icon: <ExternalLink />,
          onClick: () => {
            console.log("Open");
          },
        },
        {
          type: "separator",
        },
        ...commonItems,
      ];
    case AssetType.Shader:
      return [
        ...commonItems,
        {
          id: "open",
          label: "Open",
          onClick: () => {
            console.log("Open");
          },
        },
      ];
    default:
      return commonItems;
  }
}
