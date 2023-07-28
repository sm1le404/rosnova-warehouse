export const getTimestampRange = (dateString: string) => {
  const date = new Date(dateString);

  date.setHours(0, 0, 0, 0);

  const startTimestamp = Math.floor(date.getTime() / 1000);

  date.setHours(23, 59, 59, 999);

  const endTimestamp = Math.floor(date.getTime() / 1000);

  return {
    start: startTimestamp,
    end: endTimestamp,
  };
};
