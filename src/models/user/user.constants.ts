export const PASSWORD_SALT_ROUNDS = 6;

export const USER_VALIDATION_REGEXPS = {
  USERNAME_PATTERN: /^[a-z0-9_]+$/,
  USER_EMAIL_PATTERN: /^[\w-\.]+@([\w-l]+\.)+[\w-]{2,4}$/,
};

export const USER_VALIDATION_ERRORS = {
  USER_NOT_FOUND: 'User not found',
  USED_ALREADY_EXISTS: 'This user already exists',
};

export const USER_VISIBILITY_LEVELS = {
  FETCH_USERS: 'fetch_users',
  FETCH_ONE: 'fetch_one',
  FETCH_ME: 'fetch_me',
};

export const SWAGGER_USER_SUMMARY = {
  FETCH_USERS: 'Returns all registered users',
  FIND_ONE: 'Returns specific user (by username)',
  FETCH_PROFILE: 'Returns all data about user',
  UPDATE: 'Updates user data',
  ADD_AVATAR: "Uploads user's avatar",
  REMOVE_SELF: 'Removes user account',
  SEARCH_USERS: 'Searches user with fuzziness',
  IS_USERNAME_AVAILABLE: 'Returns true if username is available',
  IS_EMAIL_AVAILABLE: 'Returns true if email is available',
};

export const SWAGGER_USER_RESPONSES = {
  USER_NOT_FOUND: 'User with given credentials was not found',
  USER_FOUND: 'User with given credentials was found',
};
