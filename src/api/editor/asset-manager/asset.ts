import { makeAutoObservable, runInAction } from "mobx";

import { AssetManager } from "@atlas/engine/asset-manager";
import { AssetType } from "./asset-type";

type AssetConstructorArgs<T = unknown> = {
  path: string;
  initialData?: T;
  assetType: AssetType;
  metadata?: Record<string, any>;
};

export class Asset<T = unknown> {
  public data: T;
  public readonly path: string;
  public readonly assetType: AssetType;
  public readonly metadata: Record<string, any> | null = null;

  public loadingState: "idle" | "loading" | "loaded" = "idle";

  public get isLoaded() {
    return this.loadingState === "loaded";
  }

  constructor({
    path,
    initialData,
    assetType,
    metadata,
  }: AssetConstructorArgs<T>) {
    makeAutoObservable(this, undefined, { autoBind: true });

    this.path = path;
    this.assetType = assetType;
    this.metadata = metadata ?? null;

    if (initialData) {
      this.data = initialData;
      this.loadingState = "loaded";
    }
  }

  public async load() {
    if (this.isLoaded) {
      return;
    }

    this.loadingState = "loading";

    this.data = !this.metadata
      ? await AssetManager.load<T>(this.path)
      : await AssetManager.loadWithMetadata<T>(this.path, this.metadata);

    runInAction(() => {
      this.loadingState = "loaded";
    });
  }
}
