import { ClassConstructor } from "./serializers";

const PROPERTY_SYMBOL = Symbol("serialization:property");

type InstanceType = ClassConstructor<any>;

type SerializePropertyOptions =
  | InstanceType
  | {
      instanceType: InstanceType;
    };

type DoNotSerializeObject = {
  serialize: false;
};

type PropertyMetadataObject =
  | {
      instanceType?: InstanceType;
    }
  | DoNotSerializeObject;

/**
 * Decorator to mark a property as serializable.
 */
export function SerializeProperty(instanceType?: SerializePropertyOptions) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata(
      PROPERTY_SYMBOL,
      {
        instanceType:
          instanceType instanceof Function
            ? instanceType
            : instanceType?.instanceType,
      },
      target,
      propertyKey
    );
  };
}

/**
 * Decorator to mark a class as not serializable.
 */
export function DoNotSerialize(target: any) {
  Reflect.defineMetadata(
    PROPERTY_SYMBOL,
    {
      serialize: false,
    },
    target
  );
}

export function isPropertySerializable<T extends Record<string, any>>(
  target: T,
  propertyKey: string
): boolean {
  const metadata = Reflect.getMetadata(PROPERTY_SYMBOL, target, propertyKey);

  return metadata ? metadata.serialize !== false : true;
}

export function getPropertyMetadata<T extends Record<string, any>>(
  target: T,
  propertyKey: string
): PropertyMetadataObject | undefined {
  return Reflect.getMetadata(PROPERTY_SYMBOL, target, propertyKey);
}

export function getSerializedProperties<T extends Record<string, any>>(
  target: T
): Array<
  PropertyMetadataObject & {
    propertyName: string;
  }
> {
  const properties: Array<
    PropertyMetadataObject & {
      propertyName: string;
    }
  > = [];

  for (const key of Object.keys(target)) {
    const metadata = Reflect.getMetadata(PROPERTY_SYMBOL, target, key);
    if (metadata) {
      properties.push({
        ...metadata,
        propertyName: key,
      });
    }
  }

  return properties;
}
