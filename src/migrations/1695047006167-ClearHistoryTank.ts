import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClearHistoryTank1695047006167 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "tank_history"`);
    await queryRunner.query(`DELETE FROM "kafka_message"`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  async down(queryRunner: QueryRunner): Promise<void> {}
}
