export interface Command<R = any> {
    execute(): R | Promise<R>;
  }