import { Asset } from "@atlas/editor/asset-manager";
import { Scene } from "@atlas/engine/core";
import { reaction } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

export const ThumbnailSceneImage = observer(
  ({ asset }: { asset: Asset<Scene> }) => {
    const [src] = useState<string | null>(null);

    useEffect(() => {
      if (asset.loadingState === "idle") {
        asset.load();
      }

      reaction(
        () => asset.isLoaded,
        (isLoaded) => {
          if (!src && isLoaded) {
          }
        }
      );
    }, [src, asset]);

    if (!src) {
      return <div className="w-full h-full" />;
    }

    return (
      <img
        className="w-full h-full"
        src={src}
        style={{
          objectFit: "contain",
        }}
      />
    );
  }
);
