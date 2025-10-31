import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommonEntity } from '../../common/entities/common.entity';
import { Operation } from '../../operations/entities/operation.entity';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';

@Entity()
export class Driver extends CommonEntity {
  @ApiProperty({ required: true, description: 'Имя' })
  @Column({ type: 'varchar', nullable: false })
  firstName: string;

  @ApiPropertyOptional({ required: false, description: 'Отчество' })
  @Column({ type: 'varchar', nullable: true })
  middleName?: string;

  @ApiProperty({ required: true, description: 'Фамилия' })
  @Column({ type: 'varchar', nullable: false })
  lastName: string;

  @ApiProperty({ required: false, description: 'Доступность' })
  @Column({ type: 'boolean', default: true })
  isEnabled?: boolean;

  @OneToMany(() => Operation, (operation) => operation.driver)
  operation: Operation[];

  @OneToMany(() => Vehicle, (vehicle) => vehicle.driver)
  vehicle: Vehicle[];

  @Column()
  fullName: string;

  @BeforeInsert()
  getFullName() {
    this.fullName = this.middleName
      ? `${this.lastName} ${this.firstName} ${this.middleName}`.trim()
      : `${this.lastName} ${this.firstName}`;
  }

  @BeforeUpdate()
  updateFullName() {
    this.fullName = this.middleName
      ? `${this.lastName} ${this.firstName} ${this.middleName}`.trim()
      : `${this.lastName} ${this.firstName}`;
  }
}
