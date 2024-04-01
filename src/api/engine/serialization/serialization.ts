import {
  BaseSerializer,
  SceneSerializer,
  ClassConstructor,
} from "./serializers";

export class Serialization {
  public static readonly serializers: Set<BaseSerializer> = new Set([
    new SceneSerializer(),
  ]);

  private static findSerializerByClass<T>(
    klass: new (...args: any[]) => T
  ): BaseSerializer<T> | null {
    for (const serializer of Serialization.serializers) {
      if (serializer.serializeClass === klass) {
        return serializer;
      }
    }

    return null;
  }

  public static serialize<T>(data: T): string | Record<string, any> {
    const classConstructor = (data as any).constructor as ClassConstructor<T>;

    const serializer = Serialization.findSerializerByClass(classConstructor);

    if (!serializer) {
      throw new Error(`No serializer found for class ${classConstructor.name}`);
    }

    return serializer.serialize(data);
  }

  public static deserialize<T>(
    data: string | Record<string, any>,
    klass: new (...args: any[]) => T
  ): T {
    const serializer = Serialization.findSerializerByClass(klass);

    if (!serializer) {
      throw new Error(`No serializer found for class ${klass.name}`);
    }

    return serializer.deserialize(data);
  }
}
