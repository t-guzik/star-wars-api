import { HttpStatus } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { DatabasePool, sql } from 'slonik';
import { ApiErrorResponse } from '../../../../src/libs/dtos/responses/api-error.response';
import { CreateEpisodeRequestDto } from '../../../../src/modules/episode/infrastructure/dtos/requests/create-episode.request.dto';
import { getConnectionPool } from '../../../setup/jestSetupAfterEnv';
import { ApiClient } from '../../../test-utils/ApiClient';

describe('Create episode', () => {
  let pool: DatabasePool;
  const apiClient = new ApiClient();

  const dto: CreateEpisodeRequestDto = { name: 'NEWHOPE' };

  beforeAll(() => {
    pool = getConnectionPool();
  });

  afterEach(async () => {
    await pool.query(sql`TRUNCATE "star_wars"."episodes"`);
  });

  it('should create episode', async () => {
    const idResponse = await apiClient.createEpisode(dto);

    expect(idResponse.id).toBeDefined();
    expect(isUUID(idResponse.id)).toBeTruthy();
  });

  it('should return error when invalid data sent', async () => {
    const invalidDto: CreateEpisodeRequestDto = { name: '' };

    const errorResponse = (await apiClient.createEpisode(invalidDto)) as unknown as ApiErrorResponse;

    expect(errorResponse).toBeDefined();
    expect(errorResponse.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    expect(errorResponse.correlationId).toBeDefined();
    expect(errorResponse.message).toEqual('Validation error');
    expect(errorResponse.error).toBeDefined();
    expect(errorResponse.subErrors).toBeDefined();
    expect(errorResponse.subErrors?.length).toEqual(1);
  });

  it('should return error when trying to create the same episode', async () => {
    await apiClient.createEpisode(dto);
    const errorResponse = (await apiClient.createEpisode(dto)) as unknown as ApiErrorResponse;

    expect(errorResponse).toBeDefined();
    expect(errorResponse.statusCode).toEqual(HttpStatus.CONFLICT);
    expect(errorResponse.correlationId).toBeDefined();
    expect(errorResponse.message).toEqual('Episode already exists');
    expect(errorResponse.error).toBeDefined();
  });
});
