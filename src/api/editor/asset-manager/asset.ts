import { AssetType } from "./asset-type";

type AssetConstructorArgs<T = unknown> = {
  path: string;
  initialData?: T;
  assetType: AssetType;
};

export class Asset<T = unknown> {
  public data: T;
  public readonly path: string;
  public readonly assetType: AssetType;

  public isLoaded = false;

  constructor({ path, initialData, assetType }: AssetConstructorArgs<T>) {
    this.path = path;
    this.assetType = assetType;

    if (initialData) {
      this.data = initialData;
      this.isLoaded = true;
    }
  }
}
