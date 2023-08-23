export const dateWithTimeZone = (date: Date = new Date()): Date => {
  const tzOffset = new Date().getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset);
};
