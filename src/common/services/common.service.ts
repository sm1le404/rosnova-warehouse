// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import {
//   DeepPartial,
//   FindOptionsRelations,
//   FindOptionsWhere,
//   Repository,
// } from 'typeorm';
// import { CommonEntity } from '../entities/common.entity';
//
// @Injectable()
// export class CommonService<T extends CommonEntity> {
//   constructor(
//     @InjectRepository(T)
//     private commonRepository: Repository<T>,
//   ) {}
//
//   async find(
//     filter: FindOptionsWhere<T> | FindOptionsWhere<T>[],
//     relations: FindOptionsRelations<T> | FindOptionsWhere<T> = [],
//   ): Promise<T[]> {
//     return this.commonRepository.find({
//       where: filter,
//       relations,
//     });
//   }
//
//   async findOne(
//     filter: FindOptionsWhere<T>,
//     relations: FindOptionsRelations<T> | FindOptionsWhere<T> = [],
//   ): Promise<T> {
//     return this.commonRepository.findOneOrFail({
//       where: filter,
//       relations,
//     });
//   }
//
//   async create(createCommonEntity: DeepPartial<T>): Promise<T> {
//     const common = this.commonRepository.create(createCommonEntity);
//     await this.commonRepository.save(common);
//     return this.findOne({ id: common.id });
//   }
//
//   async update(
//     filter: FindOptionsWhere<T>,
//     updateCommon: DeepPartial<T>,
//   ): Promise<T> {
//     const common = await this.findOne(filter);
//     Object.assign(common, updateCommon);
//     await this.commonRepository.save(common);
//     return this.findOne(filter);
//   }
//
//   async delete(filter: FindOptionsWhere<T>): Promise<T> {
//     const common = await this.findOne(filter);
//     return this.commonRepository.softRemove(common);
//   }
//
//   async deleteMany(filter: FindOptionsWhere<T>): Promise<T[]> {
//     const commons = await this.commonRepository.find({ where: filter });
//     return this.commonRepository.softRemove(commons);
//   }
//
//   async restore(filter: FindOptionsWhere<T>): Promise<void> {
//     await this.commonRepository.restore(filter);
//   }
// }
