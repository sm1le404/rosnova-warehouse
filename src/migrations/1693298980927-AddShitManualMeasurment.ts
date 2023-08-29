import { MigrationInterface, QueryRunner } from 'typeorm';

/*eslint-disable*/
export class AddShitManualMeasurment1693298980927
  implements MigrationInterface
{
  name = 'AddShitManualMeasurment1693298980927';

  async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
          `CREATE TABLE "temporary_shift" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "startedAt" integer NOT NULL, "closedAt" integer, "startDispensersState" text, "finishDispensersState" text, "finishTankState" text, "manualTankState" text)`,
      );
      await queryRunner.query(
          `INSERT INTO "temporary_shift"("id", "createdAt", "updatedAt", "deletedAt", "startedAt", "closedAt", "startDispensersState", "finishDispensersState", "finishTankState") SELECT "id", "createdAt", "updatedAt", "deletedAt", "startedAt", "closedAt", "startDispensersState", "finishDispensersState", "finishTankState" FROM "shift"`,
      );
      await queryRunner.query(`DROP TABLE "shift"`);
      await queryRunner.query(`ALTER TABLE "temporary_shift" RENAME TO "shift"`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {}
}
