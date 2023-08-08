import { Injectable } from '@nestjs/common';
import { Mapper } from '../../../libs/infrastructure/mapper.interface';
import { CharacterEntity } from '../domain/entities/character.entity';
import { CharacterModel, characterSchema } from './adapters/character.repository';
import { CharacterResponseDto } from './dtos/responses/characters.response.dto';

@Injectable()
export class CharacterMapper implements Mapper<CharacterEntity, CharacterModel> {
  toPersistence(entity: CharacterEntity): CharacterModel {
    const copy = entity.getProps();
    const record: CharacterModel = {
      id: copy.id,
      created_at: copy.createdAt.toISOString(),
      updated_at: copy.updatedAt.toISOString(),
      name: copy.name,
      planet: copy.planet,
      episodes_ids: JSON.stringify(copy.episodesIds),
    };

    return characterSchema.parse(record);
  }

  toDomain(record: CharacterModel): CharacterEntity {
    return new CharacterEntity({
      id: record.id,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
      props: {
        name: record.name,
        planet: record.planet,
        episodesIds: JSON.parse(record.episodes_ids),
      },
    });
  }

  toResponse(entity: CharacterEntity): CharacterResponseDto {
    const props = entity.getProps();
    const response = new CharacterResponseDto(entity);
    response.name = props.name;
    response.episodes = entity.episodes.map(episode => episode.getProps().name);

    if (props.planet) {
      response.planet = props.planet;
    }

    return response;
  }
}
