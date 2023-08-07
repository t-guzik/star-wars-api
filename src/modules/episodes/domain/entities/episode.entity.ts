import { isEmpty } from 'class-validator';
import { EntityBase } from '../../../../libs/domain/entity.base';
import { ArgumentInvalidException } from '../../../../libs/domain/exceptions';
import { v4 } from 'uuid';
import { EpisodeProps, CreateEpisodeProps } from '../types/episode.types';

export class EpisodeEntity extends EntityBase<EpisodeProps> {
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
}
