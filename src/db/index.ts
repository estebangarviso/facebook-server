import mongoose, { ConnectOptions } from "mongoose";
import { DATABASE_URL, DATABASE_NAME } from "../config";
import { Logger } from "../utils";

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}
if (!DATABASE_NAME) {
  throw new Error("DATABASE_NAME is not defined");
}

let attempts = 0;
const ConnectionStates = mongoose.ConnectionStates;

const MongoConnect = async (handleOpen?: () => void) => {
  try {
    await mongoose.connect(DATABASE_URL, {
      dbName: DATABASE_NAME,
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    if (mongoose.connection.readyState === ConnectionStates.connected) {
      Logger.success(`Connected to database ${DATABASE_NAME}`);
    } else if (
      mongoose.connection.readyState === ConnectionStates.uninitialized ||
      mongoose.connection.readyState === ConnectionStates.disconnected
    ) {
      throw new Error("MongoDB is not connected");
    }

    const connection = mongoose.connection;
    connection.on("connecting", () => {
      Logger.info("Connecting to database...");
    });
    connection.on("reconnected", () => {
      Logger.success("Reconnected to database");
    });
    connection.on(
      "error",
      Logger.error.bind(Logger, "MongoDB connection error:")
    );
    connection.on("disconnected", () => {
      Logger.info("Disconnected from database");
    });
    connection.once("open", () => {
      Logger.success(`Connected to database ${DATABASE_NAME}`);
      if (handleOpen) {
        handleOpen();
      }
    });
    connection.on("close", () => {
      Logger.info("Connection to database closed");

      if (connection.readyState === ConnectionStates.disconnected) {
        attempts++;
        Logger.info(
          `After connection was close. Trying to reconnect to database in 5 seconds... #Attempt: ${attempts}`
        );
        setTimeout(() => {
          connection.removeAllListeners();
          MongoConnect();
        }, 5000);
      }
    });

    return connection;
  } catch (error) {
    Logger.error(error);
    throw error;
  }
};

export default MongoConnect;
