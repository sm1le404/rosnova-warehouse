import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { CommonEntity } from '../entities/common.entity';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';

export abstract class CommonService<T extends CommonEntity> {
  abstract getRepository(): Repository<T>;

  async find(payload: FindManyOptions<T>): Promise<T[]> {
    return this.getRepository().find({
      ...payload,
    });
  }

  async findOne(payload: FindOneOptions<T>): Promise<T> {
    return this.getRepository().findOneOrFail(payload);
  }

  async create(createCommonEntity: DeepPartial<T>): Promise<T> {
    const common = this.getRepository().create(createCommonEntity);
    return this.getRepository().save(common);
  }

  async createMany(createCommonEntity: DeepPartial<T>[]): Promise<T[]> {
    const common = this.getRepository().create(createCommonEntity);
    return this.getRepository().save(common);
  }

  async update(
    filter: FindOneOptions<T>,
    updateCommon: DeepPartial<T>,
  ): Promise<T> {
    const common = await this.findOne(filter);
    Object.assign(common, updateCommon);
    return this.getRepository().save(common);
  }

  async delete(filter: FindOneOptions<T>): Promise<T> {
    const common = await this.findOne(filter);
    return this.getRepository().softRemove(common);
  }

  async deleteMany(payload: FindManyOptions<T>): Promise<T[]> {
    const commons = await this.find(payload);
    return this.getRepository().softRemove(commons);
  }

  async deleteHardMany(payload: FindOptionsWhere<T>): Promise<DeleteResult> {
    return this.getRepository().delete(payload);
  }

  async restore(filter: FindOneOptions<T>): Promise<void> {
    const common = await this.findOne({ ...filter, withDeleted: true });
    await this.getRepository().recover(common);
  }
}
