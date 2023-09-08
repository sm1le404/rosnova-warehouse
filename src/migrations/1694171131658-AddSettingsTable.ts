import { MigrationInterface, QueryRunner } from 'typeorm';

/*eslint-disable*/
export class AddSettingsTable1694171131658 implements MigrationInterface {
  name = 'AddSettingsTable1694171131658';

  async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
          `CREATE TABLE "settings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "key" varchar NOT NULL, "value" varchar NOT NULL)`,
      );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`DROP TABLE "settings"`);
  }
}
