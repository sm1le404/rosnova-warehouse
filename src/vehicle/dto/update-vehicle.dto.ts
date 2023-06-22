import { PartialType } from '@nestjs/swagger';
import { CreateVehicleDto } from '.';

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {}
