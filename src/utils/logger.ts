import { blue, green, red, yellow, Color } from 'colors';
import WebSocketServer from 'ws';

export class Logger {
  static log(message: string | any, color: Color = green) {
    if (typeof message === 'string') {
      console.log(color(`[app] 🪵 ${message}`));
    } else {
      console.log(color(`[app] 🪵 Log started --------------------------------------------------`));
      console.log(message);
      console.log(color(`[app] 🪵 Log ended --------------------------------------------------`));
    }
  }

  static success(message: string | object) {
    if (typeof message === 'string') {
      console.log(green(`[app] 🟢 ${message}`));
    } else {
      console.log(green(`[app] 🟢 Success started --------------------------------------------------`));
      console.log(message);
      console.log(green(`[app] 🟢 Success ended --------------------------------------------------`));
    }
  }

  static error(e: Error | WebSocketServer.ErrorEvent | any) {
    if (e instanceof Error) {
      const errorStack = e?.stack?.split('\n');
      console.error(red(`[app] 🔴 ${e.message}`));
      if (errorStack) {
        errorStack.forEach((line) => {
          console.error(red(`${line}`));
        });
      }
    } else {
      if (e.target instanceof WebSocketServer) {
        const wsError = e as WebSocketServer.ErrorEvent;
        console.error(red(`[app] 🔴 WebSocketServer Error Message: ${wsError.message}`));
        if (wsError.type) {
          console.error(red(`[app] Type: ${wsError.type}`));
        }
        if (wsError.error) {
          console.error(red(`[app] Error: `), wsError.error);
        }
        return;
      }
      console.error(red(`[app] 🔴 Error started --------------------------------------------------`));
      console.error(e);
      console.error(red(`[app] 🔴 Error ended --------------------------------------------------`));
    }
  }

  static warn(message: string | any) {
    if (typeof message === 'string') {
      console.warn(yellow(`[app] 🟡 ${message}`));
    } else {
      console.warn(yellow(`[app] 🟡 Warning started --------------------------------------------------`));
      console.warn(message);
      console.warn(yellow(`[app] 🟡 Warning ended --------------------------------------------------`));
    }
  }

  static info(message: string | object) {
    if (typeof message === 'string') {
      console.info(blue(`[app] 💬 ${message}`));
    } else {
      console.info(blue(`[app] 💬 Info started --------------------------------------------------`));
      console.info(message);
      console.info(blue(`[app] 💬 Info ended --------------------------------------------------`));
    }
  }
}
