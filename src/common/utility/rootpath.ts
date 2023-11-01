import path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { config } from 'dotenv';

export const rootpath = (): string => {
  const rootPathDir = process.execPath.split(path.sep);
  rootPathDir.pop();
  let tempPath = path.join(...rootPathDir, path.sep);
  if (!path.isAbsolute(tempPath)) {
    tempPath = `${path.sep}${tempPath}`;
  }
  return path.normalize(tempPath);
};

config({
  path: !!process.env.DEV ? '.env' : `${rootpath()}.env`,
});

export enum LogDirection {
  IN = '<<',
  OUT = '>>',
}
export const logInRoot = async (
  data: string,
  direction: LogDirection = LogDirection.IN,
) => {
  if (process.env.LOG_DISPENSERS) {
    let dateString = new Date().toISOString();
    dateString = dateString.split('T')[1];
    const finalString = `${dateString.replace('Z', '')} ${direction} ${
      data + os.EOL
    }`;
    await fs.appendFileSync(
      `${path.join(
        rootpath(),
        'logs',
        `device-log-${new Date().toLocaleDateString()}.txt`,
      )}`,
      `${finalString}`,
    );
  }
};
