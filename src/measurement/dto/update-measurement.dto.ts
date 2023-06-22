import { PartialType } from '@nestjs/swagger';
import { CreateMeasurementDto } from '.';

export class UpdateMeasurementDto extends PartialType(CreateMeasurementDto) {}
