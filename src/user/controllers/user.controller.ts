import { UserService } from './../services/user.service';
import {
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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { JwtAuthGuard } from '../../auth/guard';
import { HasRole } from '../../auth/guard/has-role.guard';
import { SetRoles } from '../../auth/decorators/roles.decorator';
import { RoleType } from '../enums';

@ApiTags('User')
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, HasRole)
@SetRoles(RoleType.ADMIN)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    description: 'Get User list',
  })
  @ApiResponse({ type: User, isArray: true })
  async findAll(): Promise<User[]> {
    return this.userService.find({});
  }

  @Get(':id')
  @ApiOperation({
    description: 'Get User by id',
  })
  @ApiResponse({ type: User })
  async findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne({
      where: {
        id,
      },
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Add User',
  })
  @ApiResponse({ type: User })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update User by id',
  })
  @ApiResponse({ type: User })
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(
      {
        where: {
          id,
        },
      },
      updateUserDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete User by id',
  })
  @ApiResponse({ type: User })
  async delete(@Param('id') id: number): Promise<User> {
    return this.userService.delete({ where: { id } });
  }
}
