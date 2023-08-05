import { EpisodeEntity } from '../../../episodes/domain/entities/episode.entity';

export interface CharacterProps {
  name: string;
  episodesIds: string[];
  episodes: EpisodeEntity[];
  planet?: string;
}

export type CreateCharacterProps = CharacterProps;

