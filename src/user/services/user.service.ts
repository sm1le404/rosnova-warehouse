import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
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
}
