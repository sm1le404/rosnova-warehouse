import { PartialType } from '@nestjs/swagger';
import { CreateOperationDto } from '.';

export class UpdateOperationDto extends PartialType(CreateOperationDto) {}
