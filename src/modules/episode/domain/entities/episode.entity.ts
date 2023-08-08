import { isEmpty } from 'class-validator';
import { AggregateRoot } from '../../../../libs/domain/aggregate-root.base';
import { ArgumentInvalidException } from '../../../../libs/domain/exceptions';
import { v4 } from 'uuid';
import { EpisodeDeletedDomainEvent } from '../events/episode-deleted.domain-event';
import { EpisodeProps, CreateEpisodeProps } from '../episode.types';

export class EpisodeEntity extends AggregateRoot<EpisodeProps> {
  static create(create: CreateEpisodeProps): EpisodeEntity {
    const id = v4();
    const props: EpisodeProps = {
      ...create,
    };

    return new EpisodeEntity({id, props});
  }

  validate(): void {
    const {name} = this.props;

    if (isEmpty(name)) {
      throw new ArgumentInvalidException('Episode name cannot be empty');
    }
  }

  async onDelete() {
    this.addEvent(
      new EpisodeDeletedDomainEvent({
        aggregateId: this.id,
      }),
    );
  }
}
