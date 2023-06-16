import { Repository } from 'typeorm';

export function getCols<T>(
  repository: Repository<T>,
  exclude: (keyof T)[] = [],
): (keyof T)[] {
  return (
    repository.metadata.columns.map((col) => col.propertyName) as (keyof T)[]
  ).filter((col) => !exclude.includes(col));
}
