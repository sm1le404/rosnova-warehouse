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
// eslint-disable-next-line import/no-extraneous-dependencies
import { Response, Request } from 'express';
import { JwtRefreshAuthGuard } from '../guard';
import { TokensService } from '../services/token.service';
import { User } from '../../user/entities/user.entity';
import { ApiOkResponse } from '../../common/decorators/api-ok-response.decorator';
import { ApiBadRequestResponse } from '../../common/decorators/api-bad-request-response.decorator';
import { ResponseDto } from '../../common/dto';
import { ICurrentUser } from '../interface/current-user.interface';
import { ShiftService } from '../../shift/services/shift.service';
import { DeviceDispenserService } from '../../devices/services/device.dispenser.service';
import { DispenserService } from '../../dispenser/services/dispenser.service';

@ApiTags('Auth')
@ApiExtraModels(User)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    protected readonly tokensService: TokensService,
    protected readonly shiftService: ShiftService,
    private readonly deviceDispenserService: DeviceDispenserService,
    private readonly dispenserService: DispenserService,
  ) {}

  @Post('login')
  @ApiOperation({
    summary: 'Authorize user',
  })
  @ApiBody({ type: () => AuthLoginRequestDto })
  @ApiOkResponse('User authentification success', User)
  @ApiBadRequestResponse(['Login is not valid', 'Password is incorrect'])
  async login(
    @Body() body: AuthLoginRequestDto,
    @Res() response: Response,
  ): Promise<Response<ResponseDto<User>>> {
    try {
      await this.deviceDispenserService.updateDispenserSummary();
    } catch (e) {}

    const user: ICurrentUser = (await this.authService.login(
      body,
    )) as ICurrentUser;

    const dispensers = await this.dispenserService.find({
      select: { id: true, currentCounter: true },
    });

    await this.shiftService.update(
      {
        where: { id: user.lastShift.id },
      },
      {
        startDispensersState: JSON.stringify(
          dispensers.map((item) => {
            return {
              id: item.id,
              summary: item.currentCounter,
            };
          }),
        ),
      },
    );

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
      secure: true,
    });

    response.cookie('Refresh', refresh.token, {
      maxAge: refresh.expiredIn,
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
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
      secure: true,
    });

    response.cookie('Refresh', refresh.token, {
      maxAge: refresh.expiredIn,
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    });

    try {
      await this.deviceDispenserService.updateDispenserSummary();
    } catch (e) {}

    return response.send(user);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('logout')
  @ApiOperation({
    summary: 'Logout',
  })
  async logout(@Req() request: Request, @Res() response: Response) {
    try {
      await this.deviceDispenserService.updateDispenserSummary();
    } catch (e) {}

    const token = request.cookies.Refresh;
    if (token) {
      const dispensers = await this.dispenserService.find({
        select: { id: true, currentCounter: true },
      });
      const payload = this.tokensService.decode(token);
      await this.shiftService.update(
        { where: { id: payload.shift } },
        {
          closedAt: Math.floor(Date.now() / 1000),
          finishDispensersState: JSON.stringify(
            dispensers.map((item) => {
              return {
                id: item.id,
                summary: item.currentCounter,
              };
            }),
          ),
        },
      );
      await this.authService.updateUserRefreshToken(token, payload.id);
    }

    response.clearCookie('Authentication');
    response.clearCookie('Refresh');

    return response.sendStatus(204);
  }
}
