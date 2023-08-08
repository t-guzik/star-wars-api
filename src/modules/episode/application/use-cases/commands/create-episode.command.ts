import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommandProps } from '../../../../../libs/application/command.base';
import { AggregateID } from '../../../../../libs/domain/entity.base';
import { EpisodeEntity } from '../../../domain/entities/episode.entity';
import { EpisodeAlreadyExistsException } from '../../../domain/episode.exceptions';
import { EpisodeRepository } from '../../../domain/ports/episode.repository';
import { EPISODE_REPOSITORY } from '../../../episode.di-tokens';

export class CreateEpisodeCommand {
  readonly name: string;

  constructor(props: CommandProps<CreateEpisodeCommand>) {
    this.name = props.name;
  }
}

@CommandHandler(CreateEpisodeCommand)
export class CreateEpisodeUseCase implements ICommandHandler<CreateEpisodeCommand, AggregateID> {
  constructor(@Inject(EPISODE_REPOSITORY) private readonly repository: EpisodeRepository) {
  }

  async execute(command: CreateEpisodeCommand): Promise<AggregateID> {
    const existingEpisode = await this.repository.findOneByName(command.name);
    if (existingEpisode) {
      throw new EpisodeAlreadyExistsException();
    }

    const characterEntity = EpisodeEntity.create(command);
    await this.repository.save(characterEntity);

    return characterEntity.id;
  }
}
