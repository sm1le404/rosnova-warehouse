import { PartialType } from '@nestjs/swagger';
import { CreateShiftDto } from '.';

export class UpdateShiftDto extends PartialType(CreateShiftDto) {}
