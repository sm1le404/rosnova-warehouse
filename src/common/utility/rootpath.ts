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

export const logInRoot = (data: string) => {
  console.log(`${data + os.EOL}`);
  fs.appendFileSync(`${rootpath()}message-log.txt`, `${data + os.EOL}`);
};
