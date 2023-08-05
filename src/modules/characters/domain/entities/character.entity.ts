import { isEmpty } from 'class-validator';
import { AggregateRoot } from '../../../../libs/domain/aggregate-root.base';
import { CreateEntityProps } from '../../../../libs/domain/entity.base';
import { ArgumentInvalidException } from '../../../../libs/domain/exceptions';
import { CharacterProps, CreateCharacterProps } from '../types/character.types';
import { v4 } from 'uuid';

export class CharacterEntity extends AggregateRoot<CharacterProps> {
  private constructor(
    props: CreateEntityProps<CharacterProps>,
  ) {
    super(props);
  }

  static create(
    create: CreateCharacterProps,
  ): CharacterEntity {
    const id = v4();
    const props: CharacterProps = {
      ...create,
    };

    return new CharacterEntity({id, props});
  }

  validate(): void {
    const {episodesIds, episodes, name, planet} = this.props;

    if (episodesIds.length===episodes.length && episodes.every(episode => episodesIds.includes(episode.id))) {
      throw new ArgumentInvalidException('Invalid character episodes assigned')
    }

    if (isEmpty(name)) {
      throw new ArgumentInvalidException('Character name cannot be empty')
    }

    if (typeof planet==='string' && isEmpty(planet)) {
      throw new ArgumentInvalidException('Character planet cannot be empty')
    }
  }
}