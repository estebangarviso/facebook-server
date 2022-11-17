import { connect, connection, ConnectOptions } from "mongoose";
import { DATABASE_URL, DATABASE_NAME } from "~/config";

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}
if (!DATABASE_NAME) {
  throw new Error("DATABASE_NAME is not defined");
}

const dbConnection = () => {
  connection.once(
    "open",
    console.success.bind(console, `Connected to database ${DATABASE_NAME}`)
  );
  connection.on(
    "close",
    console.error.bind(console, `Disconnected from database ${DATABASE_NAME}`)
  );
  connection.on(
    "connecting",
    console.info.bind(
      console,
      `Trying to connect to database ${DATABASE_NAME}...`
    )
  );
  connection.on(
    "reconnected",
    console.success.bind(console, "Reconnected to database ${DATABASE_NAME}")
  );
  connection.on("error", console.error.bind(console, "DBError on connection"));
  connection.on(
    "disconnected",
    console.warn.bind(console, "Disconnected from database")
  );
  connection.on("fullsetup", () => {
    console.success.bind(
      console,
      `Connected to primary database ${DATABASE_NAME} and all secondary databases`
    );
  });

  const connectionConfig: ConnectOptions = {
    dbName: DATABASE_NAME,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    // useNewUrlParser: true, // deprecated Mongoose v6+.
    // useUnifiedTopology: true, // deprecated Mongoose v6+.
  };

  return {
    connect: async () => connect(DATABASE_URL, connectionConfig),
    disconnect: async () => connection.close(),
  };
};

export default dbConnection;
