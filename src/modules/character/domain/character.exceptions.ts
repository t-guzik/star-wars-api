import { ArgumentInvalidException, ExceptionBase } from '../../../libs/domain/exceptions';

export class CharacterAlreadyExistsException extends ExceptionBase {
  static readonly message = 'Character already exists';

  public readonly code = 'CHARACTER.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(CharacterAlreadyExistsException.message, cause, metadata);
  }
}

export class InvalidCharacterEpisodesAttached extends ArgumentInvalidException {
  constructor() {
    super('Invalid character episodes attached');
  }
}
