import { PartialType } from '@nestjs/swagger';
import { CreateTrailerDto } from '.';

export class UpdateTrailerDto extends PartialType(CreateTrailerDto) {}
