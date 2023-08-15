import { MigrationInterface, QueryRunner } from 'typeorm';

/*eslint-disable*/
export class UpdDispensersStatus1692014090949 implements MigrationInterface {
  name = 'UpdDispensersStatus1692014090949';

  async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
          `CREATE TABLE "temporary_dispenser" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "sortIndex" integer NOT NULL, "currentCounter" float NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "isBlocked" boolean NOT NULL DEFAULT (0), "addressId" integer, "error" varchar, "comId" integer, "statusId" integer)`,
      );
      await queryRunner.query(
          `INSERT INTO "temporary_dispenser"("id", "createdAt", "updatedAt", "deletedAt", "sortIndex", "currentCounter", "isEnabled", "isBlocked", "addressId", "error", "comId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "sortIndex", "currentCounter", "isEnabled", "isBlocked", "addressId", "error", "comId" FROM "dispenser"`,
      );
      await queryRunner.query(`DROP TABLE "dispenser"`);
      await queryRunner.query(
          `ALTER TABLE "temporary_dispenser" RENAME TO "dispenser"`,
      );
  }

  async down(queryRunner: QueryRunner): Promise<void> {}
}
