export const dateFormatter = (dateStart?: number, dateEnd?: number): string => {
  const dayStart = dateStart
    ? String(new Date(dateStart * 1000).getDate()).padStart(2, '0')
    : undefined;
  const monthStart = dateStart
    ? String(new Date(dateStart * 1000).getMonth() + 1).padStart(2, '0')
    : undefined;
  const yearStart = dateStart
    ? new Date(dateStart * 1000).getFullYear()
    : undefined;

  const dayEnd = dateEnd
    ? String(new Date(dateEnd * 1000).getDate()).padStart(2, '0')
    : undefined;
  const monthEnd = dateEnd
    ? String(new Date(dateEnd * 1000).getMonth() + 1).padStart(2, '0')
    : undefined;
  const yearEnd = dateEnd ? new Date(dateEnd * 1000).getFullYear() : undefined;

  if (dayStart && dayEnd) {
    return `${dayStart}.${monthStart}.${yearStart} - ${dayEnd}.${monthEnd}.${yearEnd}`;
  } else if (dateStart) {
    return `${dayStart}.${monthStart}.${yearStart}`;
  } else if (dateEnd) {
    return `${dayEnd}.${monthEnd}.${yearEnd}`;
  } else {
    return 'all';
  }
};

export const timeFormatter = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};
