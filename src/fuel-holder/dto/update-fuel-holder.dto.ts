import { PartialType } from '@nestjs/swagger';
import { CreateFuelHolderDto } from './create-fuel-holder.dto';

export class UpdateFuelHolderDto extends PartialType(CreateFuelHolderDto) {}
