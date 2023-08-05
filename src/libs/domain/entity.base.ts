import { isNotEmptyObject } from 'class-validator';
import { convertPropsToObject } from '../utils/convert-props-to-object.util';

import {
  ArgumentNotProvidedException,
  ArgumentInvalidException,
  ArgumentOutOfRangeException,
} from './exceptions';

export type AggregateID = string;

export interface BaseEntityProps {
  id: AggregateID;
}

export interface CreateEntityProps<T> {
  id: AggregateID;
  props: T;
}

export abstract class EntityBase<EntityProps> {
  constructor({id, props}: CreateEntityProps<EntityProps>) {
    this.setId(id);
    this.validateProps(props);
    this.props = props;
    this.validate();
  }

  protected readonly props: EntityProps;

  protected _id: AggregateID;

  get id(): AggregateID {
    return this._id;
  }

  private setId(id: AggregateID): void {
    this._id = id;
  }

  static isEntity(entity: unknown): entity is EntityBase<unknown> {
    return entity instanceof EntityBase;
  }

  public equals(object?: EntityBase<EntityProps>): boolean {
    if (object===null || object===undefined) {
      return false;
    }

    if (this===object) {
      return true;
    }

    if (!EntityBase.isEntity(object)) {
      return false;
    }

    return this.id ? this.id===object.id:false;
  }

  public getProps(): EntityProps & BaseEntityProps {
    const propsCopy = {
      id: this._id,
      ...this.props,
    };
    return Object.freeze(propsCopy);
  }

  public toObject(): unknown {
    const plainProps = convertPropsToObject(this.props);

    const result = {
      id: this._id,
      ...plainProps,
    };
    return Object.freeze(result);
  }

  public abstract validate(): void;

  private validateProps(props: EntityProps): void {
    const MAX_PROPS = 50;

    if (!isNotEmptyObject(props)) {
      throw new ArgumentNotProvidedException(
        'Entity props should not be empty',
      );
    }

    if (typeof props!=='object') {
      throw new ArgumentInvalidException('Entity props should be an object');
    }

    if (Object.keys(props as any).length > MAX_PROPS) {
      throw new ArgumentOutOfRangeException(
        `Entity props should not have more than ${MAX_PROPS} properties`,
      );
    }
  }
}
