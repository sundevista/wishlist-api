// File size limitation in bytes
export const FILE_SIZE_LIMITATION = 10000000;
export const ALLOWED_EXTENSIONS = ['png', 'jpeg', 'jpg'];

export const FILE_VALIDATION_ERRORS = {
  FILES_TOO_LARGE: `File size should be less than ${FILE_SIZE_LIMITATION} bytes`,
  WRONG_EXTENSION: `File has wrong extension, use one of these instead: ${ALLOWED_EXTENSIONS.join(
    ', ',
  )}`,
};
