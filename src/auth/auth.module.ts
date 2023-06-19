import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth-customer.service';
import { EncryptionService } from './services/encryption.service';
import { TokensService } from './services/token.service';
import { AnonymousStrategy } from './strategy/anonymous.strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [JwtModule.register({}), UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokensService,
    EncryptionService,
    JwtStrategy,
    AnonymousStrategy,
    JwtRefreshStrategy,
  ],
  exports: [TokensService, EncryptionService],
})
export class AuthModule {}
