import { PartialType } from '@nestjs/swagger';
import { CreateSupplyDto } from '.';

export class UpdateSupplyDto extends PartialType(CreateSupplyDto) {}
