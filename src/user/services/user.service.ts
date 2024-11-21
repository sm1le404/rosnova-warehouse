import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { CommonService } from '../../common/services/common.service';
import { EncryptionService } from '../../auth/services/encryption.service';

@Injectable()
export class UserService extends CommonService<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly encryptionService: EncryptionService,
  ) {
    super();
  }

  getRepository(): Repository<User> {
    return this.userRepository;
  }

  async update(
    filter: FindOneOptions<User>,
    updateCommon: DeepPartial<User>,
  ): Promise<User> {
    const common = await this.findOne(filter);
    if (updateCommon?.password) {
      updateCommon.password = await this.encryptionService.hash(
        updateCommon.password,
      );
    }
    Object.assign(common, updateCommon);
    return this.getRepository().save(common);
  }
}
