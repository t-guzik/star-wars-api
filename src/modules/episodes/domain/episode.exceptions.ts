import { ExceptionBase } from '../../../libs/domain/exceptions';

export class EpisodeAlreadyExistsException extends ExceptionBase {
  static readonly message = 'Episode already exists';

  public readonly code = 'EPISODE.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(EpisodeAlreadyExistsException.message, cause, metadata);
  }
}
