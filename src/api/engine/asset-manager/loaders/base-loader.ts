export abstract class BaseLoader<T = unknown, M = Record<string, any>> {
  public abstract readonly supportedExtensions: string[];

  public abstract load(path: string): Promise<T>;
  public abstract loadWithMetadata(path: string, metadata: M): Promise<T>;

  public createDefaultMedata(): M {
    return {} as M;
  }
}
