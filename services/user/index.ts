import { container } from 'tsyringe';
import 'reflect-metadata';
import { UserService } from './user.service';

const userService = container.resolve(UserService);

export { userService };
