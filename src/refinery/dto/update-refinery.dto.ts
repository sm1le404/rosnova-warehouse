import { PartialType } from '@nestjs/swagger';
import { CreateRefineryDto } from './create-refinery.dto';

export class UpdateRefineryDto extends PartialType(CreateRefineryDto) {}
