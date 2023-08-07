import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommandProps } from '../../../../../libs/application/command.base';
import { AggregateID } from '../../../../../libs/domain/entity.base';
import { EpisodeEntity } from '../../../domain/entities/episode.entity';
import { EpisodeAlreadyExistsException } from '../../../domain/episode.exceptions';
import { EpisodesRepository } from '../../../domain/ports/episodes.repository';

export class CreateEpisodeCommand {
  readonly name: string;

  constructor(props: CommandProps<CreateEpisodeCommand>) {
    this.name = props.name;
  }
}

@CommandHandler(CreateEpisodeCommand)
export class CreateEpisodeUseCase implements ICommandHandler<CreateEpisodeCommand, AggregateID> {
  constructor(
    protected readonly repository: EpisodesRepository,
  ) {
  }

  async execute(
    command: CreateEpisodeCommand
  ): Promise<AggregateID> {
    const existingEpisode = await this.repository.findOneByName(command.name);
    if (existingEpisode) {
      throw new EpisodeAlreadyExistsException()
    }

    const characterEntity = EpisodeEntity.create(command);
    await this.repository.save(characterEntity);

    return characterEntity.id;
  }
}