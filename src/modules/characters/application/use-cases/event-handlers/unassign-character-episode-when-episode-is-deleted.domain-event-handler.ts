import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { EpisodeDeletedDomainEvent } from '../../../../episodes/domain/events/episode-deleted.domain-event';
import { CharactersRepository } from '../../../domain/ports/characters.repository';

@Injectable()
export class UnassignCharacterEpisodeWhenEpisodeIsDeletedDomainEventHandler {
  constructor(
    private readonly repository: CharactersRepository,
  ) {
  }

  @OnEvent(EpisodeDeletedDomainEvent.name, {async: true, promisify: true})
  async handle(event: EpisodeDeletedDomainEvent): Promise<any> {
    const characters = await this.repository.find({episodesIds: [event.aggregateId]})
    for (const character of characters) {
      character.setEpisodesIds(character.getProps().episodesIds.filter(episodeId => episodeId!==event.aggregateId))
      await this.repository.update(character);
    }
  }
}
