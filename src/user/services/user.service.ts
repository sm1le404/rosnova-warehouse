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
import { CommonService } from '../../common/services/common.service';

@Injectable()
export class UserService extends CommonService<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super();
  }

  getRepository(): Repository<User> {
    return this.userRepository;
  }

  async findUser(
    where: FindOptionsWhere<User>,
    relations?: FindOptionsRelations<User>,
  ): Promise<User> {
    return this.userRepository.findOneOrFail({
      where,
      relations,
    });
  }

  async updateUser(
    filter: FindOptionsWhere<User>,
    model: UpdateUserDto,
  ): Promise<User> {
    await this.userRepository.update(filter, model);

    return this.findUser(filter);
  }
}
