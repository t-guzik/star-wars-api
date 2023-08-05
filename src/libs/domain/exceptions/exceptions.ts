import { ExceptionBase } from './exception.base';
import {
  ARGUMENT_INVALID,
  ARGUMENT_NOT_PROVIDED,
  ARGUMENT_OUT_OF_RANGE,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from './index';

export class ArgumentInvalidException extends ExceptionBase {
  readonly code = ARGUMENT_INVALID;
}

export class ArgumentNotProvidedException extends ExceptionBase {
  readonly code = ARGUMENT_NOT_PROVIDED;
}

export class ArgumentOutOfRangeException extends ExceptionBase {
  readonly code = ARGUMENT_OUT_OF_RANGE;
}

export class ConflictException extends ExceptionBase {
  readonly code = CONFLICT;
}

export class NotFoundException extends ExceptionBase {
  static readonly message = 'Not found';

  constructor(message = NotFoundException.message) {
    super(message);
  }

  readonly code = NOT_FOUND;
}

export class InternalServerErrorException extends ExceptionBase {
  static readonly message = 'Internal server error';

  constructor(
    message = InternalServerErrorException.message,
    cause?: Error,
    metadata?: unknown,
  ) {
    super(message, cause, metadata);
  }

  readonly code = INTERNAL_SERVER_ERROR;
}
