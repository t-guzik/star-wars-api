import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import { DatabasePool, sql } from 'slonik';
import { CreateCharacterRequestDto } from '../../../../src/modules/character/infrastructure/dtos/requests/create-character.request.dto';
import { getConnectionPool } from '../../../setup/jestSetupAfterEnv';
import { ApiClient } from '../../../test-utils/ApiClient';

describe.only('Set character episodes', () => {
  let pool: DatabasePool;
  const apiClient = new ApiClient();

  const episodesNames = ['NEWHOPE', 'EMPIRE', 'JEDI'];
  const characterRequestDto: CreateCharacterRequestDto = { name: 'Leia Organa', planet: 'Alderaan' };

  beforeAll(() => {
    pool = getConnectionPool();
  });

  afterEach(async () => {
    await pool.query(sql`TRUNCATE "star_wars"."characters"`);
    await pool.query(sql`TRUNCATE "star_wars"."episodes"`);
  });

  it('should assign episodes to character', async () => {
    const { id: characterId } = await apiClient.createCharacter(characterRequestDto);
    const episodesIdResponses = await Promise.all(episodesNames.map(name => apiClient.createEpisode({ name })));
    const { status: responseStatus } = await apiClient.setCharacterEpisodes(characterId, {
      episodesIds: episodesIdResponses.map(({ id }) => id),
    });
    const character = await apiClient.findCharacter(characterId);

    expect(responseStatus).toEqual(HttpStatus.NO_CONTENT);
    expect(characterId).toEqual(character.id);
    expect([...episodesNames].sort()).toEqual(character.episodes.sort());
  });

  it('should return error when trying to assign episodes to non existing character', async () => {
    const { body: errorResponse, status: responseStatus } = await apiClient.setCharacterEpisodes(faker.string.uuid(), {
      episodesIds: [faker.string.uuid()],
    });

    expect(responseStatus).toEqual(HttpStatus.NOT_FOUND);
    expect(errorResponse).toBeDefined();
    expect(errorResponse.statusCode).toEqual(HttpStatus.NOT_FOUND);
    expect(errorResponse.correlationId).toBeDefined();
    expect(errorResponse.message).toEqual('Not found');
    expect(errorResponse.error).toBeDefined();
  });

  it('should return error when trying to assign non existing episode', async () => {
    const { id: characterId } = await apiClient.createCharacter(characterRequestDto);
    const { body: errorResponse, status: responseStatus } = await apiClient.setCharacterEpisodes(characterId, {
      episodesIds: [faker.string.uuid()],
    });

    expect(responseStatus).toEqual(HttpStatus.BAD_REQUEST);
    expect(errorResponse).toBeDefined();
    expect(errorResponse.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    expect(errorResponse.correlationId).toBeDefined();
    expect(errorResponse.message).toEqual('Invalid episodes');
    expect(errorResponse.error).toBeDefined();
  });
});
