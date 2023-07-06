import { CurrentUser } from './../decorators/current-user.decorator';
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
import { AuthService } from '../services/auth.service';
import { AuthLoginRequestDto } from '../dto';
import { Response, Request } from 'express';
import { JwtRefreshAuthGuard } from '../guard';
import { TokensService } from '../services/token.service';
import { User } from '../../user/entities/user.entity';
import { ApiOkResponse } from '../../common/decorators/api-ok-response.decorator';
import { ApiBadRequestResponse } from '../../common/decorators/api-bad-request-response.decorator';
import { ResponseDto } from '../../common/dto';
import { ICurrentUser } from '../interface/current-user.interface';
import { ShiftService } from '../../shift/services/shift.service';

@ApiTags('Auth')
@ApiExtraModels(User)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    protected readonly tokensService: TokensService,
    protected readonly shiftService: ShiftService,
  ) {}

  @Post('login')
  @ApiOperation({
    summary: 'Authorize user',
  })
  @ApiBody({ type: AuthLoginRequestDto })
  @ApiOkResponse('User authentification success', User)
  @ApiBadRequestResponse(['Login is not valid', 'Password is incorrect'])
  async login(
    @Body() body: AuthLoginRequestDto,
    @Res() response: Response,
    @Req() request: Request,
  ): Promise<Response<ResponseDto<User>>> {
    const user: ICurrentUser = (await this.authService.login(
      body,
    )) as ICurrentUser;
    const host: string = request?.headers?.host ?? '';
    const isLocalhost: boolean = host.includes('localhost');

    const access = this.tokensService.getJwtAccessToken({
      id: user.id,
      role: user.role,
      shift: user.lastShift.id,
    });

    const refresh = this.tokensService.getJwtRefreshToken({
      id: user.id,
      role: user.role,
      shift: user.lastShift.id,
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

    const { password, ...result } = user;

    return response.send({
      data: result,
    });
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh')
  @ApiOperation({
    summary: 'Refresh auth token',
  })
  async refresh(@Req() request: Request, @Res() response: Response) {
    const host: string = request?.headers?.host ?? '';
    const isLocalhost: boolean = host.includes('localhost');
    const user: ICurrentUser | undefined = request.user as ICurrentUser;
    if (!user.id) {
      throw new BadRequestException('User not found');
    }

    const { token, expiredIn } = this.tokensService.getJwtAccessToken({
      id: user.id,
      role: user.role,
      shift: user.lastShift.id,
    });

    const refresh = this.tokensService.getJwtRefreshToken({
      id: user.id,
      role: user.role,
      shift: user.lastShift.id,
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
    summary: 'Logout',
  })
  async logout(@Req() request: Request, @Res() response: Response) {
    const token = request.cookies.Refresh;
    if (token) {
      const payload = this.tokensService.decode(token);
      await this.authService.updateUserRefreshToken(token, payload.id);
      await this.shiftService.update(
        { where: { id: payload.shift } },
        { closedAt: Date.now() },
      );
    }

    response.clearCookie('Authentication');
    response.clearCookie('Refresh');

    return response.sendStatus(204);
  }
}
