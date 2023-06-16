import type { QueryFailedError } from 'typeorm';
import { PsqlCode } from './psql-code.enum';

/**
 * Checks if typeorm throws key violates error
 *
 * @param error Any thing
 * @returns
 */
export function isKeyViolatesError(error: unknown): boolean {
  return (error as QueryFailedError).driverError?.code === PsqlCode.KeyViolates;
}
