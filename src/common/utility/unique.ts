export const unique = (data: Array<any>) => {
  return Array.from(
    new Set(
      data.map((item) =>
        JSON.stringify(
          Object.keys(item)
            .sort()
            .reduce((obj, key) => {
              obj[key] = item[key];
              return obj;
            }, {}),
        ),
      ),
    ),
  ).map((item) => JSON.parse(item));
};
