import http from 'node:http';
import dotenv from 'dotenv';
import 'reflect-metadata';
import app from './app';
import { routeSetup } from './routes';

dotenv.config({ path: '.env' });
routeSetup(app);

const port = process.env.SERVER_PORT || 5000;
app.set('port', port);

const server = http.createServer(app);

const onConnection = () => {
  const address = server.address();
  const bind =
    typeof address == 'string' ? `pipe ${address}` : `port ${address?.port}`;
  console.log('listening on ', bind);
};

const onErr = (err: NodeJS.ErrnoException) => {
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  switch (err.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} already in use`);
      process.exit(1);
      break;
    default:
      throw err;
  }
};

server.listen(port);

server.on('listening', onConnection);
server.on('error', onErr);
