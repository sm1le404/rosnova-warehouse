import { UserService } from './../services/user.service';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guard';
import { HasRole } from '../../auth/guard/has-role.guard';
import { SetRoles } from '../../auth/decorators/roles.decorator';
import { RoleType } from '../enums';
import { EncryptionService } from '../../auth/services/encryption.service';
import { UpdatePwdDto } from '../dto/update-pwd.dto';
import { isRoot } from '../../common/utility';

@ApiTags('User')
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
@SetRoles(RoleType.ADMIN)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly encryptionService: EncryptionService,
  ) {}

  @Get()
  @ApiOperation({
    description: 'Get User list',
  })
  @ApiResponse({ type: () => User, isArray: true })
  async findAll(): Promise<User[]> {
    return this.userService.find({});
  }

  @Get(':id')
  @SetRoles(RoleType.ADMIN, RoleType.OPERATOR)
  @UseGuards(JwtAuthGuard, HasRole)
  @ApiOperation({
    description: 'Get User by id',
  })
  @ApiResponse({ type: () => User })
  async findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne({
      where: {
        id,
      },
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard, HasRole)
  @ApiOperation({
    summary: 'Add User',
  })
  @ApiResponse({ type: () => OmitType(User, ['password']) })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    if (isRoot(createUserDto.role)) {
      throw new BadRequestException(
        'Нельзя создать пользователя с такой ролью',
      );
    }
    if (createUserDto?.password) {
      createUserDto.password = await this.encryptionService.hash(
        createUserDto.password,
      );
    }
    const { password, ...user } = await this.userService.create(createUserDto);

    return user as User;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, HasRole)
  @ApiOperation({
    summary: 'Update User by id',
  })
  @ApiResponse({ type: () => User })
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.findOne(id);

    if (isRoot(updateUserDto.role) || isRoot(user.role)) {
      throw new BadRequestException('Нельзя обновить пользователя');
    }

    return this.userService.update(
      {
        where: {
          id,
        },
      },
      updateUserDto,
    );
  }

  @Put(':id/pwd')
  @UseGuards(JwtAuthGuard, HasRole)
  @ApiOperation({
    summary: 'Update user pwd by id',
  })
  async updatePassword(
    @Param('id') id: number,
    @Body() updatePwdDto: UpdatePwdDto,
  ): Promise<void> {
    const user = await this.findOne(id);

    if (isRoot(user.role)) {
      throw new BadRequestException('Нельзя обновить пароль');
    }

    if (updatePwdDto?.password) {
      updatePwdDto.password = await this.encryptionService.hash(
        updatePwdDto.password,
      );
    }
    await this.userService.update({ where: { id } }, updatePwdDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, HasRole)
  @ApiOperation({
    summary: 'Delete User by id',
  })
  @ApiResponse({ type: () => User })
  async delete(@Param('id') id: number): Promise<User> {
    const user = await this.findOne(id);

    if (isRoot(user.role)) {
      throw new BadRequestException('Нельзя удалить пользователя');
    }

    return this.userService.delete({ where: { id } });
  }
}
