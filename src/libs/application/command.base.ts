import { isNotEmptyObject } from 'class-validator';
import { v4 } from 'uuid';

import { ArgumentNotProvidedException } from '../domain/exceptions';

export type CommandProps<T> = Omit<T, 'id'> & Partial<Command>;

type CommandMetadata = {
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly timestamp: string;
};

export class Command {
  readonly id: string;
  readonly metadata: CommandMetadata;

  constructor(props: CommandProps<unknown>) {
    if (!isNotEmptyObject(props)) {
      throw new ArgumentNotProvidedException('Command props should not be empty');
    }

    this.id = props.id || v4();
    this.metadata = {
      correlationId: props.metadata?.correlationId,
      causationId: props?.metadata?.causationId,
      timestamp: props?.metadata?.timestamp || new Date().toISOString(),
    };
  }
}
