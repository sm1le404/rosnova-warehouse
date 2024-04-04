import { Driver } from '../../driver/entities/driver.entity';

export const getDriverFullName = (driver?: Driver): string => {
  if (!driver) {
    return '';
  }
  return driver.middleName
    ? `${driver.lastName} ${driver.firstName[0]}. ${driver.middleName[0]}.`.trim()
    : `${driver.lastName} ${driver.firstName[0]}.`;
};
