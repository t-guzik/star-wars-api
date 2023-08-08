import { OnEvent } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { EpisodeDeletedDomainEvent } from '../../../episode/domain/events/episode-deleted.domain-event';
import { CharacterRepository } from '../../domain/ports/character.repository';
import { CHARACTER_REPOSITORY } from '../../character.di-tokens';

@Injectable()
export class UnassignCharacterEpisodeWhenEpisodeIsDeletedEventHandler {
  constructor(@Inject(CHARACTER_REPOSITORY) private readonly repository: CharacterRepository) {
  }

  @OnEvent(EpisodeDeletedDomainEvent.name, {async: true, promisify: true})
  async handle(event: EpisodeDeletedDomainEvent): Promise<any> {
    const characters = await this.repository.find({episodesIds: [event.aggregateId]});
    for (const character of characters) {
      character.setEpisodesIds(character.getProps().episodesIds.filter(episodeId => episodeId!==event.aggregateId));
      await this.repository.update(character);
    }
  }
}
