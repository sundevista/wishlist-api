import { TokenPayload } from './token-payload.interface';

export interface RequestWithUser {
  user: TokenPayload;
}
