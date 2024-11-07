import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { config } from 'dotenv';
import { isDev } from './is-dev';

export const rootpath = (): string => {
  if (process.env?.USER_DATA) {
    return `${process.env.USER_DATA}${path.sep}`;
  }
  const rootPathDir = process.execPath.split(path.sep);
  rootPathDir.pop();
  let tempPath = path.join(...rootPathDir, path.sep);
  if (!path.isAbsolute(tempPath)) {
    tempPath = `${path.sep}${tempPath}`;
  }
  return path.normalize(tempPath);
};

config({
  path: isDev() ? `.env` : `${rootpath()}.env`,
});

export enum LogDirection {
  IN = '<<',
  OUT = '>>',
}
export const logInRoot = async (
  data: string,
  logName: string,
  direction: LogDirection = LogDirection.IN,
) => {
  let dateString = new Date().toISOString();
  dateString = dateString.split('T')[1];
  const finalString = `${dateString.replace('Z', '')} ${direction} ${
    data + os.EOL
  }`;
  await fs.appendFileSync(
    `${path.join(
      rootpath(),
      'logs',
      `${logName}-${new Date().toLocaleDateString()}.txt`,
    )}`,
    `${finalString}`,
  );
};

export const logDispensers = async (
  data: string,
  direction: LogDirection = LogDirection.IN,
) => {
  if (!process.env.LOG_DISPENSERS) {
    return;
  }
  await logInRoot(data, 'device-log', direction);
};

export const logTanks = async (
  data: string,
  direction: LogDirection = LogDirection.IN,
) => {
  if (!process.env.LOG_TANKS) {
    return;
  }
  await logInRoot(data, 'tanks-log', direction);
};
