import chalk from 'chalk';

class Logger {
  get now() {
    return Intl.DateTimeFormat('en-GB', {
      minute: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      month: '2-digit',
      year: 'numeric',
      second: '2-digit',
    }).format(Date.now());
  }

  error(error: string, type = 'ERROR') {
    return console.error(`${chalk.red(`[${type.toUpperCase()}]`)}[${this.now}]: ${error}`);
  }

  success(success: string, type = 'SUCCESS') {
    return console.error(`${chalk.green(`[${type.toUpperCase()}]`)}[${this.now}]: ${success}`);
  }

  warn(warning: string, type = 'WARNING') {
    return console.warn(`${chalk.yellow(`[${type.toUpperCase()}]`)}[${this.now}]: ${warning}`);
  }

  log(message: string, type = 'INFO') {
    return console.log(`${chalk.blueBright(`[${type.toUpperCase()}]`)}[${this.now}]: ${message}`);
  }
}

export default Logger;
