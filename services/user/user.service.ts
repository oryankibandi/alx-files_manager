import { IUserRepo } from '../../repositories/types/interfaces';
import UserRepo from '../../repositories/user.repository';
import logger from '../../utils/logger';
import UserModel from '../../utils/models/userModel';
import { generateToken, hashPassword, pick } from '../../utils/utils';
import { autoInjectable, injectable } from 'tsyringe';
import {
  InvalidCredentials,
  Unauthorized,
  UserNotFound,
} from '../../utils/exceptions/user.exceptions';
import redisClient from '../../utils/redis';
import { IUserModel } from '../types/types';
import { IUserService } from '../interfaces';

@autoInjectable()
export class UserService implements IUserService {
  userRepo: UserRepo;
  redisClientInstance;
  constructor(userRepo: UserRepo) {
    this.userRepo = userRepo;
    this.redisClientInstance = redisClient;
  }

  async createUser(email: string, password: string): Promise<any> {
    const hashedPassword = hashPassword(password);

    const newUser = await this.userRepo?.createUser({
      email,
      password: hashedPassword,
    });
    logger.info('New User: ', newUser);

    return pick(newUser, { include: ['email', '_id'] });
  }

  async authenticateUser(email: string, password: string): Promise<string> {
    const exsitingUser = await this.userRepo.getUserFromEmail(email);
    console.log(`retrievedUser: ${exsitingUser}`);

    if (!exsitingUser) throw new UserNotFound(`User :${email} not found`);

    const hashedPassword = hashPassword(password);

    console.log('HashedPWD: ', hashedPassword);
    console.log('HashedPWD Type: ', typeof hashedPassword);

    if (exsitingUser.password !== hashedPassword) {
      throw new InvalidCredentials('Invalid email or password');
    }

    const token = generateToken();
    console.log('token: ', token);
    const cacheKey = `auth_${token}`;

    await this.redisClientInstance.set(
      cacheKey,
      JSON.stringify(exsitingUser),
      86400
    );
    console.log('Redis client done');

    return token;
  }

  async logOutUser(token: string): Promise<boolean> {
    const user = await this.redisClientInstance.get(`auth_${token}`);

    if (!user) throw new Unauthorized('Unauthorized');

    await this.redisClientInstance.del(`auth_${token}`);

    return true;
  }

  async retrieveUser(token: string): Promise<IUserModel> {
    const user = await this.redisClientInstance.get(`auth_${token}`);

    if (!user) throw new Unauthorized('Unauthorized');

    return JSON.parse(user);
  }
}
