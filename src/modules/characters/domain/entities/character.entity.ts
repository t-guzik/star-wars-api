import { isEmpty } from 'class-validator';
import { AggregateRoot } from '../../../../libs/domain/aggregate-root.base';
import { ArgumentInvalidException, ArgumentNotProvidedException } from '../../../../libs/domain/exceptions';
import { CharacterProps, CreateCharacterProps } from '../types/character.types';
import { v4 } from 'uuid';
import { EpisodeEntity } from '../../../episodes/domain/entities/episode.entity';

export class CharacterEntity extends AggregateRoot<CharacterProps> {
  private _episodes: EpisodeEntity[] | null = null;

  static create(create: CreateCharacterProps): CharacterEntity {
    const id = v4();
    const props: CharacterProps = {
      ...create,
      episodesIds: [],
    };

    return new CharacterEntity({id, props});
  }

  get episodes() {
    if (this._episodes===null) {
      throw new ArgumentNotProvidedException('Missing character episodes');
    }

    return this._episodes;
  }

  attachEpisodes(episodes: EpisodeEntity[]): void {
    this._episodes = episodes;
  }

  updateName(newName: string) {
    this.props.name = newName;
  }

  setPlanet(planet: string) {
    this.props.planet = planet;
  }

  removePlanet() {
    this.props.planet = null;
  }


  setEpisodes(episodesIds: string[]) {
    this.props.episodesIds = episodesIds;
  }

  validate(): void {
    const {name, planet, episodesIds} = this.props;
    const uniqueEpisodes = new Set(episodesIds);

    if (isEmpty(name)) {
      throw new ArgumentInvalidException('Character name cannot be empty');
    }

    if (typeof planet==='string' && isEmpty(planet)) {
      throw new ArgumentInvalidException('Character planet cannot be empty');
    }

    if (uniqueEpisodes.size!==episodesIds.length) {
      throw new ArgumentInvalidException('Character episodes must be unique');
    }

    if (this._episodes && episodesIds.length===this._episodes.length && this._episodes.every(episode => episodesIds.includes(episode.id))) {
      throw new ArgumentInvalidException('Invalid character episodes attached');
    }
  }
}
