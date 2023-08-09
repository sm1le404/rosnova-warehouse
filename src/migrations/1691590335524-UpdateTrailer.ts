import { MigrationInterface, QueryRunner } from 'typeorm';

/* eslint-disable */
export class UpdateTrailer1691590335524 implements MigrationInterface {
  name = 'UpdateTrailer1691590335524';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_trailer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar DEFAULT ('TRAILER'), "trailerModel" text, "regNumber" varchar NOT NULL, "currentState" text, "sectionVolumes" text NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "driverId" integer, CONSTRAINT "UQ_25f54c4034ba5687a7cb92ae52a" UNIQUE ("driverId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_trailer"("id", "createdAt", "updatedAt", "deletedAt", "type", "trailerModel", "regNumber", "currentState", "sectionVolumes", "isEnabled", "driverId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "trailerModel", "regNumber", "currentState", "sectionVolumes", "isEnabled", "driverId" FROM "trailer"`,
    );
    await queryRunner.query(`DROP TABLE "trailer"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_trailer" RENAME TO "trailer"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_trailer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar DEFAULT ('TRAILER'), "trailerModel" text, "regNumber" varchar NOT NULL, "currentState" text, "sectionVolumes" text NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_trailer"("id", "createdAt", "updatedAt", "deletedAt", "type", "trailerModel", "regNumber", "currentState", "sectionVolumes", "isEnabled") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "trailerModel", "regNumber", "currentState", "sectionVolumes", "isEnabled" FROM "trailer"`,
    );
    await queryRunner.query(`DROP TABLE "trailer"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_trailer" RENAME TO "trailer"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_trailer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('TRAILER') ) DEFAULT ('TRAILER'), "trailerModel" text, "regNumber" varchar NOT NULL, "currentState" text, "sectionVolumes" text NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_trailer"("id", "createdAt", "updatedAt", "deletedAt", "type", "trailerModel", "regNumber", "currentState", "sectionVolumes", "isEnabled") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "trailerModel", "regNumber", "currentState", "sectionVolumes", "isEnabled" FROM "trailer"`,
    );
    await queryRunner.query(`DROP TABLE "trailer"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_trailer" RENAME TO "trailer"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "trailer" RENAME TO "temporary_trailer"`,
    );
    await queryRunner.query(
      `CREATE TABLE "trailer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar DEFAULT ('TRAILER'), "trailerModel" text, "regNumber" varchar NOT NULL, "currentState" text, "sectionVolumes" text NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `INSERT INTO "trailer"("id", "createdAt", "updatedAt", "deletedAt", "type", "trailerModel", "regNumber", "currentState", "sectionVolumes", "isEnabled") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "trailerModel", "regNumber", "currentState", "sectionVolumes", "isEnabled" FROM "temporary_trailer"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_trailer"`);
    await queryRunner.query(
      `ALTER TABLE "trailer" RENAME TO "temporary_trailer"`,
    );
    await queryRunner.query(
      `CREATE TABLE "trailer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar DEFAULT ('TRAILER'), "trailerModel" text, "regNumber" varchar NOT NULL, "currentState" text, "sectionVolumes" text NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "driverId" integer, CONSTRAINT "UQ_25f54c4034ba5687a7cb92ae52a" UNIQUE ("driverId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "trailer"("id", "createdAt", "updatedAt", "deletedAt", "type", "trailerModel", "regNumber", "currentState", "sectionVolumes", "isEnabled") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "trailerModel", "regNumber", "currentState", "sectionVolumes", "isEnabled" FROM "temporary_trailer"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_trailer"`);
    await queryRunner.query(
      `ALTER TABLE "trailer" RENAME TO "temporary_trailer"`,
    );
    await queryRunner.query(
      `CREATE TABLE "trailer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar DEFAULT ('TRAILER'), "trailerModel" text, "regNumber" varchar NOT NULL, "currentState" text, "sectionVolumes" text NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "driverId" integer, CONSTRAINT "UQ_25f54c4034ba5687a7cb92ae52a" UNIQUE ("driverId"), CONSTRAINT "FK_5b335b3211426e78335226c2f11" FOREIGN KEY ("driverId") REFERENCES "driver" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "trailer"("id", "createdAt", "updatedAt", "deletedAt", "type", "trailerModel", "regNumber", "currentState", "sectionVolumes", "isEnabled", "driverId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "trailerModel", "regNumber", "currentState", "sectionVolumes", "isEnabled", "driverId" FROM "temporary_trailer"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_trailer"`);
  }
}
