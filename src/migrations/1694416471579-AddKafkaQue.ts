import { MigrationInterface, QueryRunner } from 'typeorm';

/*eslint-disable*/
export class AddKafkaQue1694416471579 implements MigrationInterface {
  name = 'AddKafkaQue1694416471579';

  async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
          `CREATE TABLE "kafka_message" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "data" text NOT NULL)`,
      );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`DROP TABLE "kafka_message"`);
  }
}
