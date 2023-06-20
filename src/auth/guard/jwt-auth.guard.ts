import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class JwtPartnerUserAuthGuard extends AuthGuard('jwt-partner') {}

@Injectable()
export class JwtCustomerAuthGuard extends AuthGuard('jwt-customer') {}
