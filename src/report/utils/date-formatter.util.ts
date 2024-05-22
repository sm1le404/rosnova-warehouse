export const dateFormatter = (dateStart?: number, dateEnd?: number): string => {
  let offsetDateStart: Date;
  let offsetDateEnd: Date;
  if (dateStart) {
    const tempDate = new Date(dateStart * 1000);
    offsetDateStart = new Date(
      tempDate.getTime() + tempDate.getTimezoneOffset() * 1000 * 60,
    );
  }

  if (dateEnd) {
    const tempDate = new Date(dateEnd * 1000);
    offsetDateEnd = new Date(
      tempDate.getTime() + tempDate.getTimezoneOffset() * 1000 * 60,
    );
  }

  const dayStart = dateStart
    ? String(offsetDateStart.getDate()).padStart(2, '0')
    : undefined;
  const monthStart = dateStart
    ? String(offsetDateStart.getMonth() + 1).padStart(2, '0')
    : undefined;
  const yearStart = dateStart ? offsetDateStart.getFullYear() : undefined;

  const dayEnd = dateEnd
    ? String(offsetDateEnd.getDate()).padStart(2, '0')
    : undefined;
  const monthEnd = dateEnd
    ? String(offsetDateEnd.getMonth() + 1).padStart(2, '0')
    : undefined;
  const yearEnd = dateEnd ? offsetDateEnd.getFullYear() : undefined;

  if (dateStart && dateEnd) {
    const equalDate =
      `${dayStart}.${monthStart}.${yearStart}` ===
      `${dayEnd}.${monthEnd}.${yearEnd}`;
    return equalDate
      ? `${dayStart}.${monthStart}.${yearStart}`
      : `${dayStart}.${monthStart}.${yearStart} - ${dayEnd}.${monthEnd}.${yearEnd}`;
  } else if (dateStart) {
    return `${dayStart}.${monthStart}.${yearStart}`;
  } else if (dateEnd) {
    return `${dayEnd}.${monthEnd}.${yearEnd}`;
  } else {
    return 'all';
  }
};

export const timeFormatter = (date: Date): string => {
  let offsetDate = new Date(
    date.getTime() + date.getTimezoneOffset() * 1000 * 60,
  );
  const hours = String(offsetDate.getHours()).padStart(2, '0');
  const minutes = String(offsetDate.getMinutes()).padStart(2, '0');
  const seconds = String(offsetDate.getSeconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};
