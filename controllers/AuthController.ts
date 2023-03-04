import { Request, Response } from 'express';
import { getCredFromHeader } from '../utils/utils';
import { userService } from '../services/user';
import ServiceError from '../utils/exceptions/base.exceptions';
import { InvalidCredentials } from '../utils/exceptions/user.exceptions';

const getConnect = async (req: Request, res: Response) => {
  const authCredentials: string | string[] | undefined =
    req.headers.Authorization || req.headers.authorization;

  if (!authCredentials)
    return res.status(401).json({
      error: 'missing auth headers',
    });

  try {
    const [email, password] = getCredFromHeader(authCredentials as string);
    console.log('email: ', email);
    console.log('password: ', password);
    const token = await userService.authenticateUser(email, password);

    return res.status(200).json({
      token,
    });
  } catch (error) {
    if (error instanceof InvalidCredentials) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    } else if (error instanceof ServiceError) {
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

const getDisconnect = async (req: Request, res: Response) => {
  const token = req.headers['X-Token'];

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
    });
  }

  try {
    await userService.logOutUser(token as string);

    return res.status(204);
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

export { getConnect, getDisconnect };
