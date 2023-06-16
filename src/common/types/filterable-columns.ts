import { BaseEntity } from 'typeorm';
import { FilterOperator } from 'nestjs-paginate/lib/paginate';

export type FilterableColumns<Entity extends BaseEntity> = Partial<
  Record<keyof Entity | string, FilterOperator[]>
>;
