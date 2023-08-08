export interface CharacterProps {
  name: string;
  episodesIds: string[];
  planet: string | null;
}

export type CreateCharacterProps = Pick<CharacterProps, 'name' | 'planet'>;
