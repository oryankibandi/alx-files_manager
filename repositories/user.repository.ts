import { Model } from 'mongoose';
import { createUserType } from './types/types';
import { IUserRepo } from './types/interfaces';
import { UserExistsError } from '../utils/exceptions/user.exceptions';
import { autoInjectable } from 'tsyringe';
import UserModel from '../utils/models/userModel';

@autoInjectable()
export default class UserRepo implements IUserRepo {
  async createUser(user: createUserType): Promise<any> {
    const existingUser = await UserModel.findOne({
      email: user.email,
    });
    if (existingUser) throw new UserExistsError('Already exist');
    return UserModel.create(user);
  }

  async getUserFromEmail(email: string): Promise<any> {
    return UserModel.findOne({
      email,
    });
  }
}
