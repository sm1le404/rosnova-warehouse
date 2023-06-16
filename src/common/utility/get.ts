const stringToPath = (path: string): string[] => {
  let output = [];

  path.split('.').forEach(function (item) {
    item.split(/\[([^}]+)\]/g).forEach(function (key) {
      if (key.length > 0) {
        output.push(key);
      }
    });
  });

  return output;
};

//get value by path from object, like lodash _.get()
export const get = (obj, path, def = null) => {
  const preparedPath = stringToPath(path);
  let current = obj;
  try {
    for (let i = 0; i < preparedPath.length; i++) {
      if (Array.isArray(current)) {
        current = current.flatMap((currentElement) =>
          get(currentElement, preparedPath[i], def),
        );
      } else if (current[preparedPath[i]]) {
        current = current[preparedPath[i]];
      } else {
        return def;
      }
    }
  } catch (e) {
    return def;
  }
  return current;
};
