import { charactersRoot, episodesRoot, HttpApiVersion } from '../../src/config/http-routes';
import { IdResponse } from '../../src/libs/dtos/responses/id.response.dto';
import { CreateCharacterRequestDto } from '../../src/modules/character/infrastructure/dtos/requests/create-character.request.dto';
import { FindCharactersPaginatedListRequestDto } from '../../src/modules/character/infrastructure/dtos/requests/find-characters-paginated-list.request.dto';
import { SetCharacterEpisodesRequestDto } from '../../src/modules/character/infrastructure/dtos/requests/set-character-episodes.request.dto';
import { CharactersPaginatedListResponseDto } from '../../src/modules/character/infrastructure/dtos/responses/characters-paginated-list.response.dto';
import { CharacterResponseDto } from '../../src/modules/character/infrastructure/dtos/responses/characters.response.dto';
import { CreateEpisodeRequestDto } from '../../src/modules/episode/infrastructure/dtos/requests/create-episode.request.dto';
import { getHttpServer } from '../setup/jestSetupAfterEnv';

export class ApiClient {
  private readonly characterUrl = `/v${HttpApiVersion.V1}/${charactersRoot}`;
  private readonly episodeUrl = `/v${HttpApiVersion.V1}/${episodesRoot}`;

  async createCharacter(dto: CreateCharacterRequestDto): Promise<IdResponse> {
    const response = await getHttpServer().post(this.characterUrl).send(dto);

    return response.body;
  }

  async deleteCharacter(id: string) {
    const { body, status } = await getHttpServer().delete(`${this.characterUrl}/${id}`);

    return { body, status };
  }

  async findCharacter(id: string): Promise<CharacterResponseDto> {
    const response = await getHttpServer().get(`${this.characterUrl}/${id}`);

    return response.body;
  }

  async findPaginatedCharacters(
    queryDto: FindCharactersPaginatedListRequestDto,
  ): Promise<CharactersPaginatedListResponseDto> {
    const response = await getHttpServer().get(this.characterUrl).query(queryDto);

    return response.body;
  }

  async setCharacterEpisodes(id: string, dto: SetCharacterEpisodesRequestDto) {
    const { body, status } = await getHttpServer().put(`${this.characterUrl}/${id}/${episodesRoot}`).send(dto);

    return { body, status };
  }

  async createEpisode(dto: CreateEpisodeRequestDto): Promise<IdResponse> {
    const response = await getHttpServer().post(this.episodeUrl).send(dto);

    return response.body;
  }

  async deleteEpisode(id: string) {
    const { body, status } = await getHttpServer().delete(`${this.episodeUrl}/${id}`);

    return { body, status };
  }
}
