export const AUTH_VALIDATION_ERRORS = {
  MAIL_ALREADY_EXISTS: 'Mail already exists',
  USER_NOT_FOUND: 'User not found',
  MAIL_INCORRECT: 'Incorrect mail',
  CODE_INCORRECT: 'Incorrect code',
  WRONG_CREDENTIALS_PROVIDED: 'Wrong credentials provided',
  TOKEN_NOT_FOUND: 'Token not found',
  AUTHORIZATION_ERROR: 'User not authorized',
  PASSWORD_ERROR_LENGTH: 'Not less than 6 and not more than 30',
};

export const REDIS_CONSTANTS = {
  USER_TOKEN: 'user_token',
  USER_CODE: 'user_code',
  CODE_EXPIRATION_TIME: 1800,
};

export const SWAGGER_AUTH_SUMMARY = {
  REGISTRATION: 'registration',
  LOGIN: 'login',
  LOGOUT: 'logout',
};
