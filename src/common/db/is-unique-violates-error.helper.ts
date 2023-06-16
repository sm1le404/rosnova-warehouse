import type { QueryFailedError } from 'typeorm';
import { PsqlCode } from './psql-code.enum';

/**
 * Checks if typeorm throws unique key violates error
 *
 * @param error Any thing
 * @returns
 */
export function isUniqueViolatesError(error: unknown): boolean {
  return (
    (error as QueryFailedError).driverError?.code === PsqlCode.UniqueViolates
  );
}
