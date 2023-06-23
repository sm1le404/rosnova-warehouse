import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
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
    type: () => PickType(Tank, ['id']),
    required: true,
    description: 'Связный резервуар',
  })
  tank: Pick<Tank, 'id'>;

  @ApiProperty({
    type: () => PickType(Outcome, ['id']),
    required: true,
    description: 'Связная выдача',
  })
  outcome: Pick<Outcome, 'id'>;

  @ApiProperty({
    type: () => PickType(Supply, ['id']),
    required: true,
    description: 'Связный приход',
  })
  supply: Pick<Supply, 'id'>;
}
