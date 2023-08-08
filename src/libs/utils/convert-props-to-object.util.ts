import { EntityBase } from '../domain/entity.base';
import { ValueObject } from '../domain/value-object.base';

const isEntity = (obj: unknown): obj is EntityBase<unknown> => {
  return (
    Object.prototype.hasOwnProperty.call(obj, 'toObject') &&
    Object.prototype.hasOwnProperty.call(obj, 'id') &&
    ValueObject.isValueObject((obj as EntityBase<unknown>).id)
  );
};

const convertToPlainObject = (item: any): any => {
  if (ValueObject.isValueObject(item)) {
    return item.unpack();
  }

  if (isEntity(item)) {
    return item.toObject();
  }

  return item;
};

export const convertPropsToObject = (props: any): any => {
  const propsCopy = structuredClone(props);

  for (const prop in propsCopy) {
    if (Array.isArray(propsCopy[prop])) {
      propsCopy[prop] = (propsCopy[prop] as Array<unknown>).map(item => {
        return convertToPlainObject(item);
      });
    }

    propsCopy[prop] = convertToPlainObject(propsCopy[prop]);
  }

  return propsCopy;
};
