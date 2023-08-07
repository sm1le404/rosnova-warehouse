import { MigrationInterface, QueryRunner } from 'typeorm';

/*eslint-disable*/
export class UpdateVehicleEntity1691074521910 implements MigrationInterface {
  name = 'UpdateVehicleEntity1691074521910';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_trailer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar DEFAULT ('TRAILER'), "trailerModel" text, "regNumber" varchar NOT NULL, "currentState" text, "sectionVolumes" text NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "driverId" integer, CONSTRAINT "UQ_25f54c4034ba5687a7cb92ae52a" UNIQUE ("driverId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_trailer"("id", "createdAt", "updatedAt", "deletedAt", "type", "trailerModel", "regNumber", "currentState", "sectionVolumes", "isEnabled") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "trailerModel", "regNumber", "currentState", "sectionVolumes", "isEnabled" FROM "trailer"`,
    );
    await queryRunner.query(`DROP TABLE "trailer"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_trailer" RENAME TO "trailer"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_vehicle" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('TRUCK','LOADER') ) NOT NULL, "carModel" text NOT NULL, "regNumber" varchar NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "driverId" integer, "trailerId" integer, CONSTRAINT "UQ_d05630c6efdefc8b7c670c344ac" UNIQUE ("driverId"), CONSTRAINT "UQ_211dafa64c1f70a0ef4cc6b77d1" UNIQUE ("trailerId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_vehicle"("id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "isEnabled") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "isEnabled" FROM "vehicle"`,
    );
    await queryRunner.query(`DROP TABLE "vehicle"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_vehicle" RENAME TO "vehicle"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_trailer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('TRAILER') ) DEFAULT ('TRAILER'), "trailerModel" text, "regNumber" varchar NOT NULL, "currentState" text, "sectionVolumes" text NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "driverId" integer, CONSTRAINT "UQ_25f54c4034ba5687a7cb92ae52a" UNIQUE ("driverId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_trailer"("id", "createdAt", "updatedAt", "deletedAt", "type", "trailerModel", "regNumber", "currentState", "sectionVolumes", "isEnabled", "driverId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "trailerModel", "regNumber", "currentState", "sectionVolumes", "isEnabled", "driverId" FROM "trailer"`,
    );
    await queryRunner.query(`DROP TABLE "trailer"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_trailer" RENAME TO "trailer"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_vehicle" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('TRUCK','LOADER') ) NOT NULL, "carModel" text NOT NULL, "regNumber" varchar NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "driverId" integer, "trailerId" integer, CONSTRAINT "UQ_d05630c6efdefc8b7c670c344ac" UNIQUE ("driverId"), CONSTRAINT "UQ_211dafa64c1f70a0ef4cc6b77d1" UNIQUE ("trailerId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_vehicle"("id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "isEnabled", "driverId", "trailerId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "isEnabled", "driverId", "trailerId" FROM "vehicle"`,
    );
    await queryRunner.query(`DROP TABLE "vehicle"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_vehicle" RENAME TO "vehicle"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_trailer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('TRAILER') ) DEFAULT ('TRAILER'), "trailerModel" text, "regNumber" varchar NOT NULL, "currentState" text, "sectionVolumes" text NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "driverId" integer, CONSTRAINT "UQ_25f54c4034ba5687a7cb92ae52a" UNIQUE ("driverId"), CONSTRAINT "FK_5b335b3211426e78335226c2f11" FOREIGN KEY ("driverId") REFERENCES "driver" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_trailer"("id", "createdAt", "updatedAt", "deletedAt", "type", "trailerModel", "regNumber", "currentState", "sectionVolumes", "isEnabled", "driverId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "trailerModel", "regNumber", "currentState", "sectionVolumes", "isEnabled", "driverId" FROM "trailer"`,
    );
    await queryRunner.query(`DROP TABLE "trailer"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_trailer" RENAME TO "trailer"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_vehicle" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('TRUCK','LOADER') ) NOT NULL, "carModel" text NOT NULL, "regNumber" varchar NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "driverId" integer, "trailerId" integer, CONSTRAINT "UQ_d05630c6efdefc8b7c670c344ac" UNIQUE ("driverId"), CONSTRAINT "UQ_211dafa64c1f70a0ef4cc6b77d1" UNIQUE ("trailerId"), CONSTRAINT "FK_cbb46518af7f7bf832253c62e08" FOREIGN KEY ("driverId") REFERENCES "driver" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_822a3a73059d1892341f5c9f8af" FOREIGN KEY ("trailerId") REFERENCES "trailer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_vehicle"("id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "isEnabled", "driverId", "trailerId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "isEnabled", "driverId", "trailerId" FROM "vehicle"`,
    );
    await queryRunner.query(`DROP TABLE "vehicle"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_vehicle" RENAME TO "vehicle"`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vehicle" RENAME TO "temporary_vehicle"`,
    );
    await queryRunner.query(
      `CREATE TABLE "vehicle" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('TRUCK','LOADER') ) NOT NULL, "carModel" text NOT NULL, "regNumber" varchar NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "driverId" integer, "trailerId" integer, CONSTRAINT "UQ_d05630c6efdefc8b7c670c344ac" UNIQUE ("driverId"), CONSTRAINT "UQ_211dafa64c1f70a0ef4cc6b77d1" UNIQUE ("trailerId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "vehicle"("id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "isEnabled", "driverId", "trailerId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "isEnabled", "driverId", "trailerId" FROM "temporary_vehicle"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_vehicle"`);
    await queryRunner.query(
      `ALTER TABLE "trailer" RENAME TO "temporary_trailer"`,
    );
    await queryRunner.query(
      `CREATE TABLE "trailer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('TRAILER') ) DEFAULT ('TRAILER'), "trailerModel" text, "regNumber" varchar NOT NULL, "currentState" text, "sectionVolumes" text NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "driverId" integer, CONSTRAINT "UQ_25f54c4034ba5687a7cb92ae52a" UNIQUE ("driverId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "trailer"("id", "createdAt", "updatedAt", "deletedAt", "type", "trailerModel", "regNumber", "currentState", "sectionVolumes", "isEnabled", "driverId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "trailerModel", "regNumber", "currentState", "sectionVolumes", "isEnabled", "driverId" FROM "temporary_trailer"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_trailer"`);
    await queryRunner.query(
      `ALTER TABLE "vehicle" RENAME TO "temporary_vehicle"`,
    );
    await queryRunner.query(
      `CREATE TABLE "vehicle" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('TRUCK','LOADER') ) NOT NULL, "carModel" text NOT NULL, "regNumber" varchar NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "driverId" integer, "trailerId" integer, CONSTRAINT "UQ_d05630c6efdefc8b7c670c344ac" UNIQUE ("driverId"), CONSTRAINT "UQ_211dafa64c1f70a0ef4cc6b77d1" UNIQUE ("trailerId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "vehicle"("id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "isEnabled", "driverId", "trailerId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "isEnabled", "driverId", "trailerId" FROM "temporary_vehicle"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_vehicle"`);
    await queryRunner.query(
      `ALTER TABLE "trailer" RENAME TO "temporary_trailer"`,
    );
    await queryRunner.query(
      `CREATE TABLE "trailer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar DEFAULT ('TRAILER'), "trailerModel" text, "regNumber" varchar NOT NULL, "currentState" text, "sectionVolumes" text NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "driverId" integer, CONSTRAINT "UQ_25f54c4034ba5687a7cb92ae52a" UNIQUE ("driverId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "trailer"("id", "createdAt", "updatedAt", "deletedAt", "type", "trailerModel", "regNumber", "currentState", "sectionVolumes", "isEnabled", "driverId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "trailerModel", "regNumber", "currentState", "sectionVolumes", "isEnabled", "driverId" FROM "temporary_trailer"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_trailer"`);
    await queryRunner.query(
      `ALTER TABLE "vehicle" RENAME TO "temporary_vehicle"`,
    );
    await queryRunner.query(
      `CREATE TABLE "vehicle" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('TRUCK','LOADER') ) NOT NULL, "carModel" text NOT NULL, "regNumber" varchar NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `INSERT INTO "vehicle"("id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "isEnabled") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "isEnabled" FROM "temporary_vehicle"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_vehicle"`);
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
  }
}
