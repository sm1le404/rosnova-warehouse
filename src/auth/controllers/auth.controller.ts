import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  Get,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth-customer.service';
import { AuthLoginRequestDto } from '../dto/auth-login-request.dto';
import { Response, Request } from 'express';
import { JwtRefreshAuthGuard } from '../guard/jwt-refresh-auth.guard';
import { TokensService } from '../services/token.service';
import { User } from '../../user/entities/user.entity';
import { ApiOkResponse } from '../../common/decorators/api-ok-response.decorator';
import { ApiBadRequestResponse } from '../../common/decorators/api-bad-request-response.decorator';
import { ResponseDto } from '../../common/dto';

@ApiTags('Auth')
@ApiExtraModels(User)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    protected readonly tokensService: TokensService,
  ) {}

  @Post('login')
  @ApiOperation({
    description: 'Authorize user',
  })
  @ApiBody({ type: AuthLoginRequestDto })
  @ApiOkResponse('User authentification success', User)
  @ApiBadRequestResponse(['Login is not valid', 'Password is incorrect'])
  async login(
    @Body() body: AuthLoginRequestDto,
    @Res() response: Response,
    @Req() request: Request,
  ): Promise<Response<ResponseDto<User>>> {
    const user = await this.authService.login(body);
    const host: string = request?.headers?.host ?? '';
    const isLocalhost: boolean = host.includes('localhost');

    const access = this.tokensService.getJwtAccessToken({
      id: user.id,
      role: user.role,
    });

    const refresh = this.tokensService.getJwtRefreshToken({
      id: user.id,
      role: user.role,
    });

    await this.authService.updateUserRefreshToken(refresh.token, user.id);

    response.cookie('Authentication', access.token, {
      maxAge: access.expiredIn,
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: !isLocalhost,
    });

    response.cookie('Refresh', refresh.token, {
      maxAge: refresh.expiredIn,
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: !isLocalhost,
    });

    return response.send({
      data: user,
    });
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh')
  @ApiOperation({
    description: 'Refresh auth token',
  })
  async refresh(@Req() request: Request, @Res() response: Response) {
    const host: string = request?.headers?.host ?? '';
    const isLocalhost: boolean = host.includes('localhost');
    const user: User | undefined = request.user as User;
    if (!user.id) {
      throw new BadRequestException('User not found');
    }

    const { token, expiredIn } = this.tokensService.getJwtAccessToken({
      id: user.id,
      role: user.role,
    });

    const refresh = this.tokensService.getJwtRefreshToken({
      id: user.id,
      role: user.role,
    });

    await this.authService.updateUserRefreshToken(refresh.token, user.id);

    response.cookie('Authentication', token, {
      maxAge: expiredIn,
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: !isLocalhost,
    });

    response.cookie('Refresh', refresh.token, {
      maxAge: refresh.expiredIn,
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: !isLocalhost,
    });

    return response.send(user);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('logout')
  @ApiOperation({
    description: 'Logout',
  })
  async logout(@Req() request: Request, @Res() response: Response) {
    const token = request.cookies.Refresh;
    if (token) {
      const payload = this.tokensService.decode(token);
      await this.authService.updateUserRefreshToken(token, payload.id);
    }

    response.clearCookie('Authentication');
    response.clearCookie('Refresh');

    return response.sendStatus(204);
  }
}
