import { Command } from './command.interface';

export class CommandExecutor {
  execute<R>(command: Command<R>): R | Promise<R> {
    return command.execute();
  }
}