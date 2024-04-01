export type ClassConstructor<T> = new (...args: any[]) => T;

export abstract class BaseSerializer<T = any> {
  abstract readonly serializeClass: ClassConstructor<T>;

  abstract serialize(data: T): Record<string, any> | string;
  abstract deserialize(data: string | Record<string, any>, ...args: any[]): T;
}
