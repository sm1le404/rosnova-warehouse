import { PartialType } from '@nestjs/swagger';
import { CreateTankDto } from '.';

export class UpdateTankDto extends PartialType(CreateTankDto) {}
