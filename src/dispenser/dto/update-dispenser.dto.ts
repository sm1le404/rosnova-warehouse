import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateDispenserDto } from './create-dispenser.dto';

export class UpdateDispenserDto extends PartialType(
  OmitType(CreateDispenserDto, ['currentCounter']),
) {}
