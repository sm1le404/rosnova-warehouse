import { MigrationInterface, QueryRunner } from 'typeorm';

/*eslint-disable*/
export class ShiftRemoveUser1693233552603 implements MigrationInterface {
  name = 'ShiftRemoveUser1693233552603';

  async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
          `CREATE TABLE "temporary_shift" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "startedAt" integer NOT NULL, "closedAt" integer, "userId" integer NOT NULL, "startDispensersState" text, "finishDispensersState" text, "finishTankState" text)`,
      );
      await queryRunner.query(
          `INSERT INTO "temporary_shift"("id", "createdAt", "updatedAt", "deletedAt", "startedAt", "closedAt", "userId", "startDispensersState", "finishDispensersState", "finishTankState") SELECT "id", "createdAt", "updatedAt", "deletedAt", "startedAt", "closedAt", "userId", "startDispensersState", "finishDispensersState", "finishTankState" FROM "shift"`,
      );
      await queryRunner.query(`DROP TABLE "shift"`);
      await queryRunner.query(`ALTER TABLE "temporary_shift" RENAME TO "shift"`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {}
}
