import { AfterLoad, Column, Entity, OneToMany } from 'typeorm';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { Outcome } from '../../outcome/entities/outcome.entity';

@Entity()
export class Driver extends CommonEntity {
  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  firstName: string;

  @ApiPropertyOptional()
  @Column({ type: 'varchar', nullable: true })
  middleName: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  lastName: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  isEnabled: boolean;

  @ApiProperty({ type: () => Outcome, isArray: true })
  @OneToMany(() => Outcome, (outcome) => outcome.driver)
  outcome: Outcome[];

  @Column()
  protected fullName: string;

  @AfterLoad()
  getFullName() {
    this.fullName =
      `${this.lastName} ${this.firstName} ${this.middleName}`.trim();
  }
}
