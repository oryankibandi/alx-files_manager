import { Request, Response } from 'express';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const getStatus = async (req: Request, res: Response) => {
  const mongoAlive = await dbClient.isAlive();
  const redisAlive = await redisClient.isAlive();

  return res.status(200).json({
    redis: redisAlive,
    db: mongoAlive,
  });
};

const getStats = async (req: Request, res: Response) => {
  const users: number = await dbClient.nbUsers();
  const files: number = await dbClient.nbFiles();

  return res.status(200).json({
    users,
    files,
  });
};

export { getStats, getStatus };
