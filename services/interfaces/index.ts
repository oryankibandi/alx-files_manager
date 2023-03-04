import { IUserModel } from '../types/types';

export interface IUserService {
  createUser(email: string, password: string): Promise<any>;

  authenticateUser(email: string, password: string): Promise<string>;

  logOutUser(token: string): Promise<boolean>;

  retrieveUser(token: string): Promise<IUserModel>;
}
