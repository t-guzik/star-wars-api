import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { CommandProps } from '../../../../../libs/application/command.base';
import { NotFoundException } from '../../../../../libs/domain/exceptions';
import { FindEpisodesByIdsQuery } from '../../../../episode/application/use-cases/queries/find-episodes-by-ids.query';
import { EpisodeEntity } from '../../../../episode/domain/entities/episode.entity';
import { CharacterRepository } from '../../../domain/ports/character.repository';
import { CHARACTER_REPOSITORY } from '../../../character.di-tokens';

export class SetCharacterEpisodesCommand {
  readonly characterId: string;
  readonly episodesIds: string[];

  constructor(props: CommandProps<SetCharacterEpisodesCommand>) {
    this.characterId = props.characterId;
    this.episodesIds = props.episodesIds;
  }
}

@CommandHandler(SetCharacterEpisodesCommand)
export class SetCharacterEpisodesUseCase implements ICommandHandler<SetCharacterEpisodesCommand, void> {
  constructor(
    @Inject(CHARACTER_REPOSITORY) private readonly repository: CharacterRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(command: SetCharacterEpisodesCommand): Promise<void> {
    const [existingCharacter, episodes] = await Promise.all([
      this.repository.findOneById(command.characterId),
      this.queryBus.execute<FindEpisodesByIdsQuery, EpisodeEntity[]>(
        new FindEpisodesByIdsQuery({ episodesIds: command.episodesIds }),
      ),
    ]);

    if (!existingCharacter) {
      throw new NotFoundException();
    }

    existingCharacter.setEpisodesIds(command.episodesIds);
    existingCharacter.attachEpisodes(episodes);

    await this.repository.update(existingCharacter);
  }
}
