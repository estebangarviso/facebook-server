import mongoose, { ConnectOptions, ConnectionStates } from 'mongoose';
import { DB_URI, DB_NAME } from '../config';
import { Logger } from '../utils';

if (!DB_URI) {
  throw new Error('DB_URI is not defined');
}
if (!DB_NAME) {
  throw new Error('DB_NAME is not defined');
}

export default function connect(handleOpen?: () => void) {
  Logger.info(`Connecting to ${DB_NAME} database...`);
  mongoose.connect(`${DB_URI}`, {
    dbName: DB_NAME,
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  } as ConnectOptions);

  const connection = mongoose.connection;
  connection.on('error', Logger.error.bind(Logger, 'MongoDB connection error:'));
  connection.on('disconnected', connect);
  connection.once('open', () => {
    Logger.success(`MongoDB connected to ${DB_NAME}`);
    if (handleOpen) {
      handleOpen();
    }
  });

  return connection;
}
