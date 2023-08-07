import { ExceptionBase } from './exception.base';
import {
  ARGUMENT_INVALID,
  ARGUMENT_NOT_PROVIDED,
  ARGUMENT_OUT_OF_RANGE,
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

export class NotFoundException extends ExceptionBase {
  static readonly message = 'Not found';
  readonly code = NOT_FOUND;

  constructor(message = NotFoundException.message) {
    super(message);
  }
}

export class InternalServerErrorException extends ExceptionBase {
  static readonly message = 'Internal server error';
  readonly code = INTERNAL_SERVER_ERROR;

  constructor(message = InternalServerErrorException.message, cause?: Error, metadata?: unknown) {
    super(message, cause, metadata);
  }
}
