import { HttpStatus } from '@nestjs/common';
import { isDateString, isUUID } from 'class-validator';
import { DatabasePool, sql } from 'slonik';
import { ApiErrorResponse } from '../../../../src/libs/dtos/responses/api-error.response';
import { CreateCharacterRequestDto } from '../../../../src/modules/character/infrastructure/dtos/requests/create-character.request.dto';
import { FindCharactersPaginatedListRequestDto } from '../../../../src/modules/character/infrastructure/dtos/requests/find-characters-paginated-list.request.dto';
import { getConnectionPool } from '../../../setup/jestSetupAfterEnv';
import { ApiClient } from '../../../test-utils/ApiClient';

describe('Create character', () => {
  let pool: DatabasePool;
  const apiClient = new ApiClient();

  const dto: CreateCharacterRequestDto = { name: 'Leia Organa', planet: 'Alderaan' };
  const queryDto: FindCharactersPaginatedListRequestDto = { limit: 5, offset: 0 };

  beforeAll(() => {
    pool = getConnectionPool();
  });

  afterEach(async () => {
    await pool.query(sql`TRUNCATE "star_wars"."characters"`);
  });

  it('should create character', async () => {
    const idResponse = await apiClient.createCharacter(dto);

    expect(idResponse.id).toBeDefined();
    expect(isUUID(idResponse.id)).toBeTruthy();
  });

  it('should return newly-created character', async () => {
    const idResponse = await apiClient.createCharacter(dto);
    const characterResponse = await apiClient.findCharacter(idResponse.id);
    const paginatedCharactersListResponse = await apiClient.findPaginatedCharacters(queryDto);

    expect(characterResponse).toBeDefined();
    expect(characterResponse.id).toEqual(idResponse.id);
    expect(isDateString(characterResponse.createdAt)).toBeTruthy();
    expect(isDateString(characterResponse.updatedAt)).toBeTruthy();
    expect(characterResponse.name).toEqual(dto.name);
    expect(characterResponse.planet).toEqual(dto.planet);

    const listItem = paginatedCharactersListResponse.items.find(item => item.id === idResponse.id);
    expect(listItem).toMatchObject(characterResponse);
  });

  it('should return error when invalid data sent', async () => {
    const invalidDto: CreateCharacterRequestDto = { name: '', planet: '' };

    const errorResponse = (await apiClient.createCharacter(invalidDto)) as unknown as ApiErrorResponse;

    expect(errorResponse).toBeDefined();
    expect(errorResponse.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    expect(errorResponse.correlationId).toBeDefined();
    expect(errorResponse.message).toBeDefined();
    expect(errorResponse.error).toBeDefined();
    expect(errorResponse.subErrors).toBeDefined();
    expect(errorResponse.subErrors?.length).toEqual(2);
  });

  it('should return error when trying to create the same character', async () => {
    await apiClient.createCharacter(dto);
    const errorResponse = (await apiClient.createCharacter(dto)) as unknown as ApiErrorResponse;

    expect(errorResponse).toBeDefined();
    expect(errorResponse.statusCode).toEqual(HttpStatus.CONFLICT);
    expect(errorResponse.correlationId).toBeDefined();
    expect(errorResponse.message).toEqual('Character already exists');
    expect(errorResponse.error).toBeDefined();
  });
});
