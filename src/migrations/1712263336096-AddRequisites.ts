import { MigrationInterface, QueryRunner } from 'typeorm';

/*eslint-disable*/
export class AddRequisites1712263336096 implements MigrationInterface {
  name = 'AddRequisites1712263336096';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_fuel_holder" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "fullName" varchar NOT NULL, "shortName" varchar, "isEnabled" boolean NOT NULL DEFAULT (1), "inn" varchar, "requisites" text)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_fuel_holder"("id", "createdAt", "updatedAt", "deletedAt", "fullName", "shortName", "isEnabled", "inn") SELECT "id", "createdAt", "updatedAt", "deletedAt", "fullName", "shortName", "isEnabled", "inn" FROM "fuel_holder"`,
    );
    await queryRunner.query(`DROP TABLE "fuel_holder"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_fuel_holder" RENAME TO "fuel_holder"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "fuel_holder" RENAME TO "temporary_fuel_holder"`,
    );
    await queryRunner.query(
      `CREATE TABLE "fuel_holder" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "fullName" varchar NOT NULL, "shortName" varchar, "isEnabled" boolean NOT NULL DEFAULT (1), "inn" varchar)`,
    );
    await queryRunner.query(
      `INSERT INTO "fuel_holder"("id", "createdAt", "updatedAt", "deletedAt", "fullName", "shortName", "isEnabled", "inn") SELECT "id", "createdAt", "updatedAt", "deletedAt", "fullName", "shortName", "isEnabled", "inn" FROM "temporary_fuel_holder"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_fuel_holder"`);
  }
}
