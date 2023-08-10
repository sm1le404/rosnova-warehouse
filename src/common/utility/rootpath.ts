import path from 'path';
import * as fs from 'fs';
import * as os from 'os';

export const rootpath = (): string => {
  const rootPathDir = process.execPath.split(path.sep);
  rootPathDir.pop();
  let tempPath = path.join(...rootPathDir, path.sep);
  if (!path.isAbsolute(tempPath)) {
    tempPath = `${path.sep}${tempPath}`;
  }
  return path.normalize(tempPath);
};

export enum LogDirection {
  IN = '<<',
  OUT = '>>',
}
export const logInRoot = async (
  data: string,
  direction: LogDirection = LogDirection.IN,
) => {
  let dateString = new Date().toISOString();
  dateString = dateString.split('T')[1];
  const finalString = `${dateString.replace('Z', '')} ${direction} ${
    data + os.EOL
  }`;
  console.log(`${finalString}`);
  await fs.appendFileSync(`${rootpath()}message-log.txt`, `${finalString}`);
};
