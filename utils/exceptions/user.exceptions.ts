import ServiceError from './base.exceptions';

export class UserExistsError extends ServiceError {
  constructor(message: string) {
    super();
    this.name = 'UserExistsError';
    this.message = message;
  }
}

export class UserNotFound extends ServiceError {
  constructor(message: string) {
    super();
    this.name = 'UserNotFound';
    this.message = message;
  }
}

export class InvalidCredentials extends ServiceError {
  constructor(message: string) {
    super();
    this.name = 'InvalidCredentials';
    this.message = message;
  }
}

export class InvalidCredentialsHeader extends ServiceError {
  constructor(message: string) {
    super();
    this.name = 'InvalidCredentialsHeader';
    this.message = message;
  }
}

export class Unauthorized extends ServiceError {
  constructor(message: string) {
    super();
    this.name = 'Unauthorized';
    this.message = message;
  }
}

export class Unauthenticated extends ServiceError {
  constructor(message: string) {
    super();
    this.name = 'Unauthenticated';
    this.message = message;
  }
}
