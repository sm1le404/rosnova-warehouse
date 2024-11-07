import * as fs from 'fs';
import * as path from 'path';
import { rimraf } from 'rimraf';

export const getDirectories = (srcPath: string) => {
  return fs
    .readdirSync(srcPath)
    .map((file) => path.join(srcPath, file))
    .filter((path) => fs.statSync(path).isDirectory());
};

export const clearDir = async (baseRootPath: string) => {
  const rootPathDir = baseRootPath.split(path.sep);
  rootPathDir.pop();
  let tempPath = path.join(...rootPathDir, path.sep);

  const dirs = getDirectories(tempPath);

  for (const dirName of dirs) {
    if (dirName.includes('app') && dirName != baseRootPath) {
      await rimraf(dirName);
    }
  }
};
