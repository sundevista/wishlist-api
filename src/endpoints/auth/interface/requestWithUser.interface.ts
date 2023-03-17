import { TokenPayload } from './tokenPayload.interface';

export interface RequestWithUser {
  user: TokenPayload;
}
