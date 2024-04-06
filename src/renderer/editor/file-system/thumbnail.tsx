import {
  FileDescriptor,
  AssetDatabase,
  AssetType,
  SceneManager,
  EditorRenderer,
  Asset,
  EditorScene,
  Selection,
} from "@atlas/editor";
import { TextureObject } from "@atlas/engine";
import { Folder, Music, ShieldQuestion } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useMemo, useEffect, useRef } from "react";
import { ThumbnailSceneImage } from "./thumbnail-scene-img";
import { FileSystemStore } from "./utils";
import { SimpleContextMenu } from "@/components/ui/context-menu";
import { getThumbnailContextMenu } from "./thumbnail-context-menu";
import { Draggable, DraggableTypes } from "@/components/ui/draggable";

export const Thumbnail = observer(({ file }: { file: FileDescriptor }) => {
  const asset = useMemo(() => {
    return AssetDatabase.findAsset<any>(file.id, file.metadata);
  }, [file]);

  useEffect(() => {
    if (file.assetType === AssetType.Texture) {
      asset.load().then(() => {
        Object.entries((asset.data as TextureObject).sprites).forEach(
          ([, sprite]) => {
            // SceneManager?.currentScene?.scene.container.addChild(sprite.sprite);
            // EditorRenderer.render(SceneManager.currentScene!.scene!);
            // EditorRenderer.toBase64(SceneManager.currentScene!.scene!);
          }
        );
      });
    }
  }, []);

  const Children = observer(() => {
    if (file.isDirectory) {
      return <Folder />;
    }

    switch (file.assetType) {
      case AssetType.Scene:
        return <ThumbnailSceneImage asset={asset as Asset<any>} />;
      case AssetType.Audio:
        return <Music />;
      case AssetType.Texture:
        return (
          <div
            className="w-full h-full flex-1 bg-no-repeat bg-center"
            style={{
              backgroundSize: "contain",
              backgroundImage: `url(${file.assetPath})`,
            }}
          ></div>
        );
      default:
        return <ShieldQuestion />;
    }
  });

  return (
    <SimpleContextMenu menuItems={getThumbnailContextMenu(asset)}>
      <Draggable asChild type={DraggableTypes.ASSET} data={asset}>
        <div
          className="select-none w-[120px] h-[120px] flex flex-col gap-1 items-center justify-between p-1 rounded bg-black/20 shadow-md transition-all hover:shadow-lg hover:scale-[1.01]"
          onDoubleClick={() => {
            if (file.isDirectory) {
              FileSystemStore.selectById(file.id);
            } else if (file.assetType === AssetType.Scene) {
              asset.load().then(() => {
                SceneManager.setCurrentScene(
                  new EditorScene(asset.data as any)
                );
              });
            } else if (file.assetType === AssetType.Texture) {
              asset.load().then(() => {
                Selection.select(asset.data as TextureObject);
              });
            }
          }}
          onClick={() => {
            if (file.assetType === AssetType.Texture) {
              asset.load().then(() => {
                Selection.select(asset.data as TextureObject);
              });
            }
          }}
        >
          <div className="flex items-center justify-center w-full h-full bg-white/[0.05] checkered-bg">
            <Children />
          </div>

          <div className="flex items-center w-[inherit] px-1">
            <span className="text-[10px] font-semibold w-[inherit] truncate">
              {file.name}
            </span>
            {file.extension && (
              <span className="text-[10px] font-normal">.{file.extension}</span>
            )}
          </div>
        </div>
      </Draggable>
    </SimpleContextMenu>
  );
});
