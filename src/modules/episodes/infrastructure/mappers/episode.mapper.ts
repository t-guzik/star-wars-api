import { Injectable } from '@nestjs/common';
import { Mapper } from '../../../../libs/infrastructure/mapper.interface';
import { EpisodeEntity } from '../../domain/entities/episode.entity';
import { EpisodeModel, episodeSchema } from '../adapters/episodes.repository';

@Injectable()
export class EpisodeMapper implements Mapper<EpisodeEntity, EpisodeModel> {
  toPersistence(entity: EpisodeEntity): EpisodeModel {
    const copy = entity.getProps();
    const record: EpisodeModel = {
      id: copy.id,
      created_at: copy.createdAt.toISOString(),
      updated_at: copy.updatedAt.toISOString(),
      name: copy.name,
    };

    return episodeSchema.parse(record);
  }

  toDomain(record: EpisodeModel): EpisodeEntity {
    return new EpisodeEntity({
      id: record.id,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
      props: {
        name: record.name,
      },
    });
  }

  toResponse(_entity: EpisodeEntity): any {
    throw new Error('Not implemented');
  }
}
