import { DomainEvent, DomainEventProps } from '../../../../libs/domain/domain-event.base';

export class EpisodeDeletedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<EpisodeDeletedDomainEvent>) {
    super(props);
  }
}
