import { PartialType } from '@nestjs/swagger';
import { CreateCalibrationDto } from '.';

export class UpdateCalibrationDto extends PartialType(CreateCalibrationDto) {}
