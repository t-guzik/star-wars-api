import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommandProps } from '../../../../../libs/application/command.base';
import { NotFoundException } from '../../../../../libs/domain/exceptions';
import { EpisodesRepository } from '../../../domain/ports/episodes.repository';

export class DeleteEpisodeCommand {
  readonly episodeId: string;

  constructor(props: CommandProps<DeleteEpisodeCommand>) {
    this.episodeId = props.episodeId;
  }
}

@CommandHandler(DeleteEpisodeCommand)
export class DeleteEpisodeUseCase implements ICommandHandler<DeleteEpisodeCommand, void> {
  constructor(protected readonly repository: EpisodesRepository) {
  }

  async execute(command: DeleteEpisodeCommand): Promise<void> {
    const existingEpisode = await this.repository.findOneById(command.episodeId);
    if (!existingEpisode) {
      throw new NotFoundException('Episode not found');
    }

    await this.repository.transaction(async () => this.repository.delete(existingEpisode));
  }
}
