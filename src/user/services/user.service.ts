import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import {
  DeepPartial,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { isUniqueViolatesError } from '../../common/db';
import { UpdateUserDto } from '../dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    protected readonly userRepository: Repository<User>,
  ) {}

  async findOne(
    where: FindOptionsWhere<User>,
    relations?: FindOptionsRelations<User>,
  ): Promise<User> {
    return this.userRepository.findOneOrFail({
      where,
      relations,
    });
  }

  async update(
    filter: FindOptionsWhere<User>,
    model: UpdateUserDto,
  ): Promise<User> {
    await this.userRepository.update(filter, model);

    return this.findOne(filter);
  }
}
