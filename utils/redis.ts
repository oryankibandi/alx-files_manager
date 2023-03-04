import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

class RedisClient {
  REDIS_PORT;
  client;

  constructor() {
    this.REDIS_PORT = process.env.REDIS_PORT || 6379;
    this.client = createClient(this.REDIS_PORT);

    this.client.on(
      'error',
      (err: any) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        console.log('Redis client not connected to the server: ', err)
      // eslint-disable-next-line function-paren-newline
    );
    this.client.on('connected', () =>
      process.stdout.write('Redis connected\n')
    );

    Promise.resolve(this.client.connect());
  }

  isAlive() {
    if (this.client) return true;
    return false;
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async set(key: string, value: string | number, duration: string | number) {
    return this.client.set(key, value, duration);
  }

  async del(key: string) {
    return this.client.del(key);
  }
}

export default new RedisClient();
