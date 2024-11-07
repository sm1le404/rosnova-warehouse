import * as fs from 'fs';
import * as os from 'os';

/**
 * @param envFilePath
 */
export const readEnvVars = (envFilePath) => {
  if (!fs.existsSync(envFilePath)) {
    fs.writeFileSync(envFilePath, '', { flag: 'wx' });
  }
  return fs.readFileSync(envFilePath, 'utf-8').split(os.EOL);
};

/**
 * @param envFilePath
 * @param {string} key Key to find
 * @returns {string|null} Value of the key
 */
export const getEnvValue = (envFilePath: string, key: string) => {
  // find the line that contains the key (exact match)
  const matchedLine = readEnvVars(envFilePath).find(
    (line) => line.split('=')[0] === key,
  );
  // split the line (delimiter is '=') and return the item at index 2
  return matchedLine !== undefined ? matchedLine.split('=')[1] : null;
};

/**
 * @param envFilePath
 * @param {string} key Key to update/insert
 * @param {string} value Value to update/insert
 */
export const setEnvValue = (
  envFilePath: string,
  key: string,
  value: string,
) => {
  const envVars = readEnvVars(envFilePath);
  const targetLine = envVars.find((line) => line.split('=')[0] === key);
  if (targetLine !== undefined) {
    // update existing line
    const targetLineIndex = envVars.indexOf(targetLine);
    // replace the key/value with the new value
    envVars.splice(targetLineIndex, 1, `${key}=${value.trim()}`);
  } else {
    // create new key value
    envVars.push(`${key}=${value.trim()}`);
  }
  // write everything back to the file system
  fs.writeFileSync(envFilePath, envVars.join(os.EOL));
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface envFieldInterface {
  name: string;
  code: string;
  type: 'text' | 'checkbox';
  value?: string;
}
export const envirmomentFields: Array<envFieldInterface> = [
  {
    name: 'Имя файла БД',
    code: 'DB_NAME',
    type: 'text',
  },
  {
    name: 'Порт приложения',
    code: 'APP_PORT',
    type: 'text',
  },
  {
    name: 'Включить HTTPS',
    code: 'HTTPS',
    type: 'checkbox',
  },
  {
    name: 'Порт клиента',
    code: 'CLIENT_PORT',
    type: 'text',
  },
  {
    name: 'COM порт резервуаров',
    code: 'TANK_PORT',
    type: 'text',
  },
  {
    name: 'Включить логирование колонок',
    code: 'LOG_DISPENSERS',
    type: 'checkbox',
  },
  {
    name: 'Включить логирование резевуаров',
    code: 'LOG_TANKS',
    type: 'checkbox',
  },
  {
    name: 'Код склада',
    code: 'SHOP_KEY',
    type: 'text',
  },
  {
    name: 'Kafka адреса брокеров, через запятую',
    code: 'KAFKA_BROKERS_LIST',
    type: 'text',
  },
  {
    name: 'Kafka имя получателя',
    code: 'KAFKA_CONSUMER_NAME',
    type: 'text',
  },
  {
    name: 'Логин kafka',
    code: 'KAFKA_PLAIN_LOGIN',
    type: 'text',
  },
  {
    name: 'Пароль kafka',
    code: 'KAFKA_PLAIN_PWD',
    type: 'text',
  },
];
