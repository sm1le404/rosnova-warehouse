import { MigrationInterface, QueryRunner } from 'typeorm';

/* eslint-disable max-len*/
export class Init1687178849481 implements MigrationInterface {
  name = 'Init1687178849481';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "driver" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "firstName" varchar NOT NULL, "middleName" varchar, "lastName" varchar NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "fullName" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "dispenser" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "sortIndex" integer NOT NULL, "currentCounter" float NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `CREATE TABLE "shift" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "startedAt" integer NOT NULL, "closedAt" integer NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "event" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "name" varchar NOT NULL, "type" varchar CHECK( "type" IN ('PROCESS') ) NOT NULL DEFAULT ('PROCESS'), "collection" varchar CHECK( "collection" IN ('PROCESS') ) NOT NULL DEFAULT ('PROCESS'), "dataBefore" varchar NOT NULL, "dataAfter" varchar NOT NULL, "shiftId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "fuel_holder" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "fullName" varchar NOT NULL, "shortName" varchar, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tank" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "activeFuel" varchar CHECK( "activeFuel" IN ('PETROL') ) NOT NULL DEFAULT ('PETROL'), "sortIndex" integer NOT NULL, "calibrationTable" float NOT NULL, "totalVolume" float NOT NULL, "deathBalance" float NOT NULL, "temperature" float NOT NULL, "volume" float NOT NULL, "weight" float NOT NULL, "density" float NOT NULL, "level" integer NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `CREATE TABLE "measurement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "volume" float NOT NULL, "weight" float NOT NULL, "density" float NOT NULL, "level" integer NOT NULL, "shiftId" integer, "tankId" integer, CONSTRAINT "REL_9db39d4bd115c73809964f0b81" UNIQUE ("shiftId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "outcome" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "status" varchar CHECK( "status" IN ('PROCESS') ) NOT NULL DEFAULT ('PROCESS'), "numberTTN" integer NOT NULL, "docVolume" float NOT NULL, "docWeight" float NOT NULL, "docDensity" float NOT NULL, "docTemperature" float NOT NULL, "factVolume" float NOT NULL, "factWeight" float NOT NULL, "factDensity" float NOT NULL, "counterBefore" float NOT NULL, "counterAfter" float NOT NULL, "volumeBefore" float NOT NULL, "volumeAfter" float NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "fuel" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "name" varchar NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `CREATE TABLE "refinery" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "fullName" varchar NOT NULL, "shortName" varchar, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `CREATE TABLE "supply" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "driverName" varchar NOT NULL, "type" varchar CHECK( "type" IN ('PROCESS') ) NOT NULL DEFAULT ('PROCESS'), "numberTTN" integer NOT NULL, "docVolume" float NOT NULL, "docWeight" float NOT NULL, "docDensity" float NOT NULL, "docTemperature" float NOT NULL, "factVolume" float NOT NULL, "factWeight" float NOT NULL, "factDensity" float NOT NULL, "factByTank" float NOT NULL, "difference" float NOT NULL, "volumeBefore" float NOT NULL, "volumeAfter" float NOT NULL, "levelBefore" float NOT NULL, "levelAfter" float NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "role" varchar CHECK( "role" IN ('USER','ADMIN') ) NOT NULL DEFAULT ('USER'), "login" varchar NOT NULL, "password" varchar NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `CREATE TABLE "vehicle" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "type" varchar CHECK( "type" IN ('TRUCK') ) NOT NULL DEFAULT ('TRUCK'), "carModel" varchar CHECK( "carModel" IN ('UNKNOWN') ) NOT NULL DEFAULT ('UNKNOWN'), "regNumber" varchar NOT NULL, "tanksVolume" float NOT NULL, "tanksCalibration" float NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_event" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "name" varchar NOT NULL, "type" varchar CHECK( "type" IN ('PROCESS') ) NOT NULL DEFAULT ('PROCESS'), "collection" varchar CHECK( "collection" IN ('PROCESS') ) NOT NULL DEFAULT ('PROCESS'), "dataBefore" varchar NOT NULL, "dataAfter" varchar NOT NULL, "shiftId" integer, CONSTRAINT "FK_b73505b6ca6ee9d0207ab350cfc" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_event"("id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId" FROM "event"`,
    );
    await queryRunner.query(`DROP TABLE "event"`);
    await queryRunner.query(`ALTER TABLE "temporary_event" RENAME TO "event"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_measurement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "volume" float NOT NULL, "weight" float NOT NULL, "density" float NOT NULL, "level" integer NOT NULL, "shiftId" integer, "tankId" integer, CONSTRAINT "REL_9db39d4bd115c73809964f0b81" UNIQUE ("shiftId"), CONSTRAINT "FK_9db39d4bd115c73809964f0b81f" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_92f5563f093215be4ca1005b0ac" FOREIGN KEY ("tankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_measurement"("id", "createdAt", "updatedAt", "deletedAt", "volume", "weight", "density", "level", "shiftId", "tankId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "volume", "weight", "density", "level", "shiftId", "tankId" FROM "measurement"`,
    );
    await queryRunner.query(`DROP TABLE "measurement"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_measurement" RENAME TO "measurement"`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "measurement" RENAME TO "temporary_measurement"`,
    );
    await queryRunner.query(
      `CREATE TABLE "measurement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "volume" float NOT NULL, "weight" float NOT NULL, "density" float NOT NULL, "level" integer NOT NULL, "shiftId" integer, "tankId" integer, CONSTRAINT "REL_9db39d4bd115c73809964f0b81" UNIQUE ("shiftId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "measurement"("id", "createdAt", "updatedAt", "deletedAt", "volume", "weight", "density", "level", "shiftId", "tankId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "volume", "weight", "density", "level", "shiftId", "tankId" FROM "temporary_measurement"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_measurement"`);
    await queryRunner.query(`ALTER TABLE "event" RENAME TO "temporary_event"`);
    await queryRunner.query(
      `CREATE TABLE "event" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "name" varchar NOT NULL, "type" varchar CHECK( "type" IN ('PROCESS') ) NOT NULL DEFAULT ('PROCESS'), "collection" varchar CHECK( "collection" IN ('PROCESS') ) NOT NULL DEFAULT ('PROCESS'), "dataBefore" varchar NOT NULL, "dataAfter" varchar NOT NULL, "shiftId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "event"("id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId" FROM "temporary_event"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_event"`);
    await queryRunner.query(`DROP TABLE "vehicle"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "supply"`);
    await queryRunner.query(`DROP TABLE "refinery"`);
    await queryRunner.query(`DROP TABLE "fuel"`);
    await queryRunner.query(`DROP TABLE "outcome"`);
    await queryRunner.query(`DROP TABLE "measurement"`);
    await queryRunner.query(`DROP TABLE "tank"`);
    await queryRunner.query(`DROP TABLE "fuel_holder"`);
    await queryRunner.query(`DROP TABLE "event"`);
    await queryRunner.query(`DROP TABLE "shift"`);
    await queryRunner.query(`DROP TABLE "dispenser"`);
    await queryRunner.query(`DROP TABLE "driver"`);
  }
}
