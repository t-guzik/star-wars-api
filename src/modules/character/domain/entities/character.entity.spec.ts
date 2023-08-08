import { EpisodeEntity } from '../../../episode/domain/entities/episode.entity';
import { CreateCharacterProps } from '../character.types';
import { CharacterEntity } from './character.entity';

describe('Character entity', () => {
  const props: CreateCharacterProps = { planet: null, name: 'Test' };

  it('should create valid character entity', () => {
    const character = CharacterEntity.create(props);
    expect(character).toBeDefined();
    expect(character.getProps().name).toEqual(props.name);
  });

  it('should change character planet', () => {
    const planet = 'Alderaan';
    const character = CharacterEntity.create(props);
    expect(character.getProps().planet).toBeNull();

    character.setPlanet(planet);
    expect(character.getProps().planet).toEqual(planet);
  });

  it('should change character name', () => {
    const newName = 'New Name';
    const character = CharacterEntity.create(props);
    expect(character.getProps().name).toEqual(props.name);

    character.updateName(newName);
    expect(character.getProps().name).toEqual(newName);
  });

  it('should change character episodes', () => {
    const episode = EpisodeEntity.create({ name: 'Test episode' });
    const character = CharacterEntity.create(props);
    expect(character.getProps().episodesIds.length).toEqual(0);
    expect(character.hasEpisodeAssigned(episode.id)).toBeFalsy();

    character.setEpisodesIds([episode.id]);
    expect(character.getProps().episodesIds.length).toEqual(1);

    try {
      character.episodes;
    } catch (error) {
      expect(error.message).toEqual('Missing character episodes');
    }

    character.attachEpisodes([episode]);
    expect(character.hasEpisodeAssigned(episode.id)).toBeTruthy();
    expect(character.episodes).toEqual([episode]);
  });
});
