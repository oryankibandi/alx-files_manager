import { Request, Response } from 'express';
import { userRegistrationValidation } from '../utils/validators/user.validator';
import { userService } from '../services/user';
import ServiceError from '../utils/exceptions/base.exceptions';
import { decodeTextBase64, pick } from '../utils/utils';

const addUser = async (req: Request, res: Response) => {
  if (!req.body.email) {
    return res.status(400).json({
      error: 'Missing email',
    });
  }
  if (!req.body.password) {
    return res.status(400).json({
      error: 'Missing password',
    });
  }

  const { error } = userRegistrationValidation(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }

  try {
    const newUser = await userService.createUser(
      req.body.email,
      req.body.password
    );

    return res.status(200).json({
      id: newUser._id,
      email: newUser.email,
    });
  } catch (error) {
    if (error instanceof ServiceError) {
      return res.status(400).json({
        error: error.message,
      });
    }
    console.log('ERR: ', error);
    return res.status(500).json({
      error: 'Internal Server Error',
    });
  }
};

const getMe = async (req: Request, res: Response) => {
  const token = req.headers['X-Token'] || req.headers['x-token'];

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
    });
  }

  try {
    const user = await userService.retrieveUser(token as string);
    const fiteredUser = pick(user, { include: ['email', '_id'] });
    console.log('User: ', user);
    console.log('fiteredUser: ', fiteredUser);

    return res.status(200).json({
      email: fiteredUser?.email,
      id: fiteredUser?._id,
    });
  } catch (error) {
    if (error instanceof ServiceError) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: 'Internal Server Error',
    });
  }
};

export { addUser, getMe };
