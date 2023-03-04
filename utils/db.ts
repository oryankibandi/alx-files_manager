import dotenv from 'dotenv';
import mongoose, { Mongoose } from 'mongoose';
import logger from './logger';

dotenv.config();

class DBClient {
  host = process.env.DB_HOST;
  port = process.env.DB_PORT || 27017;
  database = process.env.DB_DATABASE || 'files_manager';
  database_pwd = process.env.DB_PWD;
  user = process.env.DB_USER;
  isConnected = false;
  client;

  constructor() {
    // mongoose.connect(`mongodb://${this.host}:${this.port}/${this.database}`);
    mongoose.connection.on('connected', () => {
      this.isConnected = true;
      // process.stdout.write('Connected to DB\n');
      logger.info('Connected to DB');
    });
    mongoose.connection.on('disconnected', () => {
      this.isConnected = false;
      process.stdout.write('Unable to connect to mongo');
    });
    this.client = Promise.resolve(this.connect());
  }

  async connect(): Promise<Mongoose> {
    const url = `mongodb://${this.host}:${this.port}/${this.database}?retryWrites=true`;

    console.log('URL: ', url);
    return mongoose.connect(url, {
      auth: {
        username: this.user,
        password: this.database_pwd,
      },
      keepAlive: true,
      keepAliveInitialDelay: 300000,
    });
  }

  async isAlive(): Promise<boolean> {
    return true;
  }

  // FIXME: Add user collection
  async nbUsers(): Promise<number> {
    return 4;
  }

  // FIXME: Add files collection
  async nbFiles(): Promise<number> {
    return 4;
  }
}

export default new DBClient();
