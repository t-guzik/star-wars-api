import { isNotEmptyObject } from 'class-validator';
import { v4 } from 'uuid';
import { RequestContextService } from '../application/context/AppRequestContext';
import { ArgumentNotProvidedException } from './exceptions';

type DomainEventMetadata = {
  readonly timestamp: number;
  readonly correlationId: string;
  readonly causationId?: string;
};

export type DomainEventProps<T> = Omit<T, 'id' | 'metadata'> & {
  aggregateId: string;
  metadata?: DomainEventMetadata;
};

export abstract class DomainEvent {
  public readonly id: string;

  /** Aggregate ID where domain event occurred */
  public readonly aggregateId: string;

  public readonly metadata: DomainEventMetadata;

  constructor(props: DomainEventProps<unknown>) {
    if (!isNotEmptyObject(props)) {
      throw new ArgumentNotProvidedException('DomainEvent props should not be empty');
    }
    this.id = v4();
    this.aggregateId = props.aggregateId;
    this.metadata = {
      correlationId: props?.metadata?.correlationId || RequestContextService.getRequestId(),
      causationId: props?.metadata?.causationId,
      timestamp: props?.metadata?.timestamp || Date.now(),
    };
  }
}
