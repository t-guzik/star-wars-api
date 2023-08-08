import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import { DatabasePool, sql } from 'slonik';
import { CreateCharacterRequestDto } from '../../../../src/modules/character/infrastructure/dtos/requests/create-character.request.dto';
import { CreateEpisodeRequestDto } from '../../../../src/modules/episode/infrastructure/dtos/requests/create-episode.request.dto';
import { getConnectionPool } from '../../../setup/jestSetupAfterEnv';
import { ApiClient } from '../../../test-utils/ApiClient';

describe('Delete episode', () => {
  let pool: DatabasePool;
  const apiClient = new ApiClient();

  const episodesNames = ['NEWHOPE', 'EMPIRE', 'JEDI'];
  const dto: CreateEpisodeRequestDto = { name: 'NEWHOPE' };

  beforeAll(() => {
    pool = getConnectionPool();
  });

  afterEach(async () => {
    await pool.query(sql`TRUNCATE "star_wars"."characters"`);
    await pool.query(sql`TRUNCATE "star_wars"."episodes"`);
  });

  it('should delete existing episode', async () => {
    const idResponse = await apiClient.createEpisode(dto);
    const { status: responseStatus } = await apiClient.deleteEpisode(idResponse.id);

    expect(idResponse.id).toBeDefined();
    expect(responseStatus).toEqual(HttpStatus.NO_CONTENT);
  });

  it('should unassign deleted episode from characters', async () => {
    const characterRequestDto: CreateCharacterRequestDto = { name: 'Leia Organa', planet: 'Alderaan' };
    const { id: characterId } = await apiClient.createCharacter(characterRequestDto);
    const episodesIdResponses = await Promise.all(episodesNames.map(name => apiClient.createEpisode({ name })));
    await apiClient.setCharacterEpisodes(characterId, { episodesIds: episodesIdResponses.map(({ id }) => id) });
    const character = await apiClient.findCharacter(characterId);

    expect(characterId).toEqual(character.id);
    expect([...episodesNames].sort()).toEqual(character.episodes.sort());

    const { status: responseStatus } = await apiClient.deleteEpisode(episodesIdResponses[0].id);
    const updatedCharacter = await apiClient.findCharacter(characterId);
    expect(responseStatus).toEqual(HttpStatus.NO_CONTENT);
    expect(updatedCharacter.episodes.length).toEqual(2);
    expect([...episodesNames].slice(1, episodesNames.length).sort()).toEqual(updatedCharacter.episodes.sort());
  });

  it('should return error when trying to delete non existing episode', async () => {
    const { status: responseStatus, body: errorResponse } = await apiClient.deleteEpisode(faker.string.uuid());

    expect(responseStatus).toEqual(HttpStatus.NOT_FOUND);
    expect(errorResponse).toBeDefined();
    expect(errorResponse.statusCode).toEqual(HttpStatus.NOT_FOUND);
    expect(errorResponse.correlationId).toBeDefined();
    expect(errorResponse.message).toEqual('Not found');
    expect(errorResponse.error).toBeDefined();
  });
});
