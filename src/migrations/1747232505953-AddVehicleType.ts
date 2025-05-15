import { MigrationInterface, QueryRunner } from 'typeorm';

/*eslint-disable*/
export class AddVehicleType1747232505953 implements MigrationInterface {
  name = 'AddVehicleType1747232505953';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_vehicle" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('TRUCK','LOADER','WAGON') ) NOT NULL, "carModel" text NOT NULL, "regNumber" varchar NOT NULL, "currentState" text, "sectionVolumes" text, "isEnabled" boolean NOT NULL DEFAULT (1), "driverId" integer, "trailerId" integer, CONSTRAINT "FK_cbb46518af7f7bf832253c62e08" FOREIGN KEY ("driverId") REFERENCES "driver" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_822a3a73059d1892341f5c9f8af" FOREIGN KEY ("trailerId") REFERENCES "trailer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_vehicle"("id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "currentState", "sectionVolumes", "isEnabled", "driverId", "trailerId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "currentState", "sectionVolumes", "isEnabled", "driverId", "trailerId" FROM "vehicle"`,
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
      `CREATE TABLE "vehicle" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('TRUCK','LOADER','WAGON') ) NOT NULL, "carModel" text NOT NULL, "regNumber" varchar NOT NULL, "currentState" text, "sectionVolumes" text, "isEnabled" boolean NOT NULL DEFAULT (1), "driverId" integer, "trailerId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "vehicle"("id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "currentState", "sectionVolumes", "isEnabled", "driverId", "trailerId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "currentState", "sectionVolumes", "isEnabled", "driverId", "trailerId" FROM "temporary_vehicle"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_vehicle"`);
  }
}
