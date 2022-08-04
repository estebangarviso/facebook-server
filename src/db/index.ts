import mongoose, { ConnectOptions, ConnectionStates } from 'mongoose';
import { DB_URI, DB_NAME } from '../config';
import { Logger } from '../utils';

if (!DB_URI) {
  throw new Error('DB_URI is not defined');
}
if (!DB_NAME) {
  throw new Error('DB_NAME is not defined');
}

let attempts = 0;

export default function connect(handleOpen?: () => void) {
  mongoose.connect(`${DB_URI}`, {
    dbName: DB_NAME,
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  } as ConnectOptions);

  const connection = mongoose.connection;
  connection.on('connecting', () => {
    Logger.info('Connecting to database...');
  });
  connection.on('reconnected', () => {
    Logger.success('Reconnected to database');
  });
  connection.on('error', Logger.error.bind(Logger, 'MongoDB connection error:'));
  connection.on('disconnected', () => {
    Logger.info('Disconnected from database');
  });
  connection.once('open', () => {
    Logger.success(`Connected to database ${DB_NAME}`);
    if (handleOpen) {
      handleOpen();
    }
  });
  connection.on('close', () => {
    Logger.info('Connection to database closed');

    if (connection.readyState === ConnectionStates.disconnected) {
      attempts++;
      Logger.info(`After connection was close. Trying to reconnect to database in 5 seconds... #Attempt: ${attempts}`);
      setTimeout(() => {
        connection.removeAllListeners();
        connect();
      }, 5000);
    }
  });

  return connection;
}
