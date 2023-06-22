import { PartialType } from '@nestjs/swagger';
import { CreateOutcomeDto } from '.';

export class UpdateOutcomeDto extends PartialType(CreateOutcomeDto) {}
