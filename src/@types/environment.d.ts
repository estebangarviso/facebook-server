export {};
import { LogLevelDesc } from "loglevel";
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN_SECRET: string;
      ACCESS_TOKEN_EXPIRES_IN: string;
      PORT: string;
      FRONTEND_ORIGIN: string;
      DB_URI: string;
      DB_NAME: string;
      SKIP_VALIDATION: "true" | "false";
      SALT_WORK_FACTOR: string;
      WEBSOCKET_SERVER_KEY: string;
      PAGE_SIZES: string;
      MAINTENANCE_MODE: "true" | "false";
      MAINTENANCE_MODE_WHITELIST_IPS: string;
      LOG_LEVEL: LogLevelDesc;
    }
  }
}
