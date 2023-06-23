import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Outcome } from '../../outcome/entities/outcome.entity';
import { Supply } from '../../supply/entities/supply.entity';
import { Tank } from '../../tank/entities/tank.entity';

export class CreateFuelDto {
  @ApiProperty({ required: true, description: 'Название' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, description: 'Доступность' })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @ApiProperty({
    type: Array,
    required: true,
    description: 'Связный резервуар',
  })
  tank: Tank;

  @ApiProperty({
    type: Array,
    required: true,
    description: 'Связная выдача',
  })
  outcome: Pick<Outcome, 'id'>[];

  @ApiProperty({
    type: Array,
    required: true,
    description: 'Связный приход',
  })
  supply: Pick<Supply, 'id'>[];
}
