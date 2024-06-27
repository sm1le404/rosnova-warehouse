export const isDev = (): boolean => {
  if (!('DEV' in process.env)) {
    return false;
  }
  return typeof process.env.DEV === 'string'
    ? process.env.DEV === 'true'
    : process.env.DEV;
};
