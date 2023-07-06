import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { EncryptionService } from './services/encryption.service';
import { TokensService } from './services/token.service';
import { AnonymousStrategy } from './strategy/anonymous.strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { ShiftService } from '../shift/services/shift.service';
import { Shift } from '../shift/entities/shift.entity';

@Module({
  imports: [
    JwtModule.register({}),
    UserModule,
    TypeOrmModule.forFeature([User, Shift]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokensService,
    EncryptionService,
    JwtStrategy,
    AnonymousStrategy,
    JwtRefreshStrategy,
    UserService,
    ShiftService,
  ],
  exports: [TokensService, EncryptionService],
})
export class AuthModule {}
