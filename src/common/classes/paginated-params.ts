import { Column, RelationColumn } from 'nestjs-paginate/lib/helper';
import { FilterableColumns } from '../types/filterable-columns';
import { BaseEntity } from 'typeorm';
import { PaginateQuery } from 'nestjs-paginate/lib/decorator';

export class PaginatedParams<T extends BaseEntity> implements PaginateQuery {
  page?: number;

  limit?: number;

  sortBy?: [string, 'ASC' | 'DESC'][];

  searchBy?: string[];

  search?: string;

  filter?: { [column: string]: string | string[] };

  path: string;

  private _relationList: RelationColumn<T>[] = [];

  get relationList() {
    return this._relationList;
  }

  set relationList(relations: RelationColumn<T>[]) {
    this._relationList = relations;
  }

  private _filterableColumns: FilterableColumns<T> = {};

  get filterableColumns() {
    return this._filterableColumns;
  }

  set filterableColumns(filter: FilterableColumns<T>) {
    this._filterableColumns = filter;
  }

  private _defaultSortBy: [keyof T, 'ASC' | 'DESC'][] = [];

  get defaultSortBy() {
    return this._defaultSortBy;
  }

  set defaultSortBy(sort: [keyof T, 'ASC' | 'DESC'][]) {
    this._defaultSortBy = sort;
  }

  private _maxLimit: number = 1000;

  get maxLimit() {
    return this._maxLimit;
  }

  set maxLimit(limit: number) {
    this._maxLimit = limit;
  }

  private _defaultLimit: number = 20;

  get defaultLimit() {
    return this._defaultLimit;
  }

  set defaultLimit(limit: number) {
    this._defaultLimit = limit;
  }

  private _sortableColumns: Column<T>[] = [];

  get sortableColumns() {
    return this._sortableColumns;
  }

  set sortableColumns(columns: Column<T>[]) {
    this._sortableColumns = columns;
  }

  private _searchableColumns: Column<T>[] = [];

  get searchableColumns() {
    return this._searchableColumns;
  }

  set searchableColumns(columns: Column<T>[]) {
    this._searchableColumns = columns;
  }

  private _selectedColumns: Column<T>[] = [];

  get selectedColumns() {
    return this._selectedColumns;
  }

  set selectedColumns(columns: Column<T>[]) {
    this._selectedColumns = columns;
  }
}
