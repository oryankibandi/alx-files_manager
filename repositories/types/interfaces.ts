import { createUserType } from './types';

export interface IUserRepo {
  createUser(user: createUserType): Promise<any>;

  getUserFromEmail(email: string): Promise<any>;
}
