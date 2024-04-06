import { EditorRenderer } from "@atlas/editor/renderers";
import { observer } from "mobx-react-lite";
import { Sprite } from "pixi.js";
import { useEffect, useState } from "react";

export const SpriteImage = observer(({ sprite }: { sprite: Sprite }) => {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    EditorRenderer.toBase64(sprite).then((data) => {
      setSrc(data);
    });
  }, [src, sprite]);

  if (!src) {
    return <div className="w-full h-full" />;
  }

  return (
    <div className="w-full h-full checkered-bg flex items-center justify-center">
      <img className="max-w-full h-auto border border-white/10" src={src} />
    </div>
  );
});
