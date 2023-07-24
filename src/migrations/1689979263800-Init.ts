import { MigrationInterface, QueryRunner } from 'typeorm';
/* eslint-disable */
export class Init1689979263800 implements MigrationInterface {
  name = 'Init1689979263800';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "dispenser" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "sortIndex" integer NOT NULL, "currentCounter" float NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "isBlocked" boolean NOT NULL DEFAULT (0), "addressId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "event" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "name" varchar NOT NULL, "type" varchar CHECK( "type" IN ('default','create','update','delete') ) NOT NULL DEFAULT ('default'), "collection" varchar CHECK( "collection" IN ('default','operation','fuel','shift','settings') ) NOT NULL DEFAULT ('default'), "dataBefore" varchar NOT NULL, "dataAfter" varchar NOT NULL, "shiftId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "role" varchar CHECK( "role" IN ('OPERATOR','ADMIN') ) NOT NULL DEFAULT ('OPERATOR'), "login" varchar NOT NULL, "password" varchar NOT NULL, "refreshToken" varchar, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `CREATE TABLE "shift" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "startedAt" integer NOT NULL, "closedAt" integer, "userId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "measurement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "volume" float NOT NULL, "weight" float NOT NULL, "density" float NOT NULL, "temperature" float NOT NULL, "level" integer NOT NULL, "shiftId" integer, "tankId" integer, CONSTRAINT "REL_9db39d4bd115c73809964f0b81" UNIQUE ("shiftId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "fuel" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "name" varchar NOT NULL, "fullName" varchar NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `CREATE TABLE "fuel_holder" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "fullName" varchar NOT NULL, "shortName" varchar, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `CREATE TABLE "refinery" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "fullName" varchar NOT NULL, "shortName" varchar, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tank" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "sortIndex" integer NOT NULL, "calibrationTable" float DEFAULT (0), "totalVolume" float NOT NULL, "deathBalance" float NOT NULL DEFAULT (0), "temperature" float NOT NULL DEFAULT (0), "volume" float NOT NULL DEFAULT (0), "weight" float NOT NULL DEFAULT (0), "density" float NOT NULL DEFAULT (0), "level" integer NOT NULL DEFAULT (0), "isEnabled" boolean NOT NULL DEFAULT (1), "isBlocked" boolean NOT NULL DEFAULT (0), "addressId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "trailer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('TRAILER') ) DEFAULT ('TRAILER'), "trailerModel" text, "regNumber" varchar NOT NULL, "currentState" text, "sectionVolumes" text NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `CREATE TABLE "vehicle" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('TRUCK','LOADER') ) NOT NULL, "carModel" text NOT NULL, "regNumber" varchar NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `CREATE TABLE "operation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('outcome','supply','internal','return') ) NOT NULL, "status" varchar CHECK( "status" IN ('created','started','progress','interrupted','stopped','finished') ) NOT NULL DEFAULT ('created'), "vehicleState" text NOT NULL, "destination" text, "numberTTN" text NOT NULL, "startedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "finishedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "docVolume" float NOT NULL, "factVolume" float, "docWeight" float NOT NULL, "docDensity" float NOT NULL, "docTemperature" float NOT NULL, "counterBefore" float DEFAULT (0), "counterAfter" float DEFAULT (0), "volumeBefore" float DEFAULT (0), "volumeAfter" float DEFAULT (0), "levelBefore" float DEFAULT (0), "levelAfter" float DEFAULT (0), "dispenserError" boolean DEFAULT (0), "dispenserId" integer, "driverId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer, "trailerId" integer, "vehicleId" integer, "tankId" integer, "shiftId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "driver" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "firstName" varchar NOT NULL, "middleName" varchar, "lastName" varchar NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "fullName" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_event" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "name" varchar NOT NULL, "type" varchar CHECK( "type" IN ('default','create','update','delete') ) NOT NULL DEFAULT ('default'), "collection" varchar CHECK( "collection" IN ('default','operation','fuel','shift','settings') ) NOT NULL DEFAULT ('default'), "dataBefore" varchar NOT NULL, "dataAfter" varchar NOT NULL, "shiftId" integer, CONSTRAINT "FK_b73505b6ca6ee9d0207ab350cfc" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_event"("id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId" FROM "event"`,
    );
    await queryRunner.query(`DROP TABLE "event"`);
    await queryRunner.query(`ALTER TABLE "temporary_event" RENAME TO "event"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_shift" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "startedAt" integer NOT NULL, "closedAt" integer, "userId" integer, CONSTRAINT "FK_d6c3886ef9888f23e6d995d2640" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_shift"("id", "createdAt", "updatedAt", "deletedAt", "startedAt", "closedAt", "userId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "startedAt", "closedAt", "userId" FROM "shift"`,
    );
    await queryRunner.query(`DROP TABLE "shift"`);
    await queryRunner.query(`ALTER TABLE "temporary_shift" RENAME TO "shift"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_measurement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "volume" float NOT NULL, "weight" float NOT NULL, "density" float NOT NULL, "temperature" float NOT NULL, "level" integer NOT NULL, "shiftId" integer, "tankId" integer, CONSTRAINT "REL_9db39d4bd115c73809964f0b81" UNIQUE ("shiftId"), CONSTRAINT "FK_9db39d4bd115c73809964f0b81f" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_92f5563f093215be4ca1005b0ac" FOREIGN KEY ("tankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_measurement"("id", "createdAt", "updatedAt", "deletedAt", "volume", "weight", "density", "temperature", "level", "shiftId", "tankId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "volume", "weight", "density", "temperature", "level", "shiftId", "tankId" FROM "measurement"`,
    );
    await queryRunner.query(`DROP TABLE "measurement"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_measurement" RENAME TO "measurement"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_tank" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "sortIndex" integer NOT NULL, "calibrationTable" float DEFAULT (0), "totalVolume" float NOT NULL, "deathBalance" float NOT NULL DEFAULT (0), "temperature" float NOT NULL DEFAULT (0), "volume" float NOT NULL DEFAULT (0), "weight" float NOT NULL DEFAULT (0), "density" float NOT NULL DEFAULT (0), "level" integer NOT NULL DEFAULT (0), "isEnabled" boolean NOT NULL DEFAULT (1), "isBlocked" boolean NOT NULL DEFAULT (0), "addressId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer, CONSTRAINT "FK_7c395f57b1846cc188c6b559b27" FOREIGN KEY ("fuelId") REFERENCES "fuel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_6b1a641fdf709ce3154d47b787b" FOREIGN KEY ("fuelHolderId") REFERENCES "fuel_holder" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_d5c1e4908b46f8f996288846dae" FOREIGN KEY ("refineryId") REFERENCES "refinery" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_tank"("id", "createdAt", "updatedAt", "deletedAt", "sortIndex", "calibrationTable", "totalVolume", "deathBalance", "temperature", "volume", "weight", "density", "level", "isEnabled", "isBlocked", "addressId", "fuelId", "fuelHolderId", "refineryId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "sortIndex", "calibrationTable", "totalVolume", "deathBalance", "temperature", "volume", "weight", "density", "level", "isEnabled", "isBlocked", "addressId", "fuelId", "fuelHolderId", "refineryId" FROM "tank"`,
    );
    await queryRunner.query(`DROP TABLE "tank"`);
    await queryRunner.query(`ALTER TABLE "temporary_tank" RENAME TO "tank"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_operation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('outcome','supply','internal','return') ) NOT NULL, "status" varchar CHECK( "status" IN ('created','started','progress','interrupted','stopped','finished') ) NOT NULL DEFAULT ('created'), "vehicleState" text NOT NULL, "destination" text, "numberTTN" text NOT NULL, "startedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "finishedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "docVolume" float NOT NULL, "factVolume" float, "docWeight" float NOT NULL, "docDensity" float NOT NULL, "docTemperature" float NOT NULL, "counterBefore" float DEFAULT (0), "counterAfter" float DEFAULT (0), "volumeBefore" float DEFAULT (0), "volumeAfter" float DEFAULT (0), "levelBefore" float DEFAULT (0), "levelAfter" float DEFAULT (0), "dispenserError" boolean DEFAULT (0), "dispenserId" integer, "driverId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer, "trailerId" integer, "vehicleId" integer, "tankId" integer, "shiftId" integer, CONSTRAINT "FK_44a506978936572278194b22c22" FOREIGN KEY ("dispenserId") REFERENCES "dispenser" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4fe00161ef48138bfa3f434d1e2" FOREIGN KEY ("driverId") REFERENCES "driver" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_1ec7313173df4fe9b3d0cd9ff56" FOREIGN KEY ("fuelId") REFERENCES "fuel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_2a95009217197ba57060423fc00" FOREIGN KEY ("fuelHolderId") REFERENCES "fuel_holder" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4fa6456e8465dc3738f18ade562" FOREIGN KEY ("refineryId") REFERENCES "refinery" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_92a920d504d3057fbca9e0acb81" FOREIGN KEY ("trailerId") REFERENCES "trailer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_289c58cdde3f9e5e7d1c9111b6f" FOREIGN KEY ("vehicleId") REFERENCES "vehicle" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7c627c969c9eeccceb4b290806c" FOREIGN KEY ("tankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0fe8d164f8e00199fff3a1ab00e" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_operation"("id", "createdAt", "updatedAt", "deletedAt", "type", "status", "vehicleState", "destination", "numberTTN", "startedAt", "finishedAt", "docVolume", "factVolume", "docWeight", "docDensity", "docTemperature", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "dispenserError", "dispenserId", "driverId", "fuelId", "fuelHolderId", "refineryId", "trailerId", "vehicleId", "tankId", "shiftId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "status", "vehicleState", "destination", "numberTTN", "startedAt", "finishedAt", "docVolume", "factVolume", "docWeight", "docDensity", "docTemperature", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "dispenserError", "dispenserId", "driverId", "fuelId", "fuelHolderId", "refineryId", "trailerId", "vehicleId", "tankId", "shiftId" FROM "operation"`,
    );
    await queryRunner.query(`DROP TABLE "operation"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_operation" RENAME TO "operation"`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "operation" RENAME TO "temporary_operation"`,
    );
    await queryRunner.query(
      `CREATE TABLE "operation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('outcome','supply','internal','return') ) NOT NULL, "status" varchar CHECK( "status" IN ('created','started','progress','interrupted','stopped','finished') ) NOT NULL DEFAULT ('created'), "vehicleState" text NOT NULL, "destination" text, "numberTTN" text NOT NULL, "startedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "finishedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "docVolume" float NOT NULL, "factVolume" float, "docWeight" float NOT NULL, "docDensity" float NOT NULL, "docTemperature" float NOT NULL, "counterBefore" float DEFAULT (0), "counterAfter" float DEFAULT (0), "volumeBefore" float DEFAULT (0), "volumeAfter" float DEFAULT (0), "levelBefore" float DEFAULT (0), "levelAfter" float DEFAULT (0), "dispenserError" boolean DEFAULT (0), "dispenserId" integer, "driverId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer, "trailerId" integer, "vehicleId" integer, "tankId" integer, "shiftId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "operation"("id", "createdAt", "updatedAt", "deletedAt", "type", "status", "vehicleState", "destination", "numberTTN", "startedAt", "finishedAt", "docVolume", "factVolume", "docWeight", "docDensity", "docTemperature", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "dispenserError", "dispenserId", "driverId", "fuelId", "fuelHolderId", "refineryId", "trailerId", "vehicleId", "tankId", "shiftId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "status", "vehicleState", "destination", "numberTTN", "startedAt", "finishedAt", "docVolume", "factVolume", "docWeight", "docDensity", "docTemperature", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "dispenserError", "dispenserId", "driverId", "fuelId", "fuelHolderId", "refineryId", "trailerId", "vehicleId", "tankId", "shiftId" FROM "temporary_operation"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_operation"`);
    await queryRunner.query(`ALTER TABLE "tank" RENAME TO "temporary_tank"`);
    await queryRunner.query(
      `CREATE TABLE "tank" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "sortIndex" integer NOT NULL, "calibrationTable" float DEFAULT (0), "totalVolume" float NOT NULL, "deathBalance" float NOT NULL DEFAULT (0), "temperature" float NOT NULL DEFAULT (0), "volume" float NOT NULL DEFAULT (0), "weight" float NOT NULL DEFAULT (0), "density" float NOT NULL DEFAULT (0), "level" integer NOT NULL DEFAULT (0), "isEnabled" boolean NOT NULL DEFAULT (1), "isBlocked" boolean NOT NULL DEFAULT (0), "addressId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "tank"("id", "createdAt", "updatedAt", "deletedAt", "sortIndex", "calibrationTable", "totalVolume", "deathBalance", "temperature", "volume", "weight", "density", "level", "isEnabled", "isBlocked", "addressId", "fuelId", "fuelHolderId", "refineryId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "sortIndex", "calibrationTable", "totalVolume", "deathBalance", "temperature", "volume", "weight", "density", "level", "isEnabled", "isBlocked", "addressId", "fuelId", "fuelHolderId", "refineryId" FROM "temporary_tank"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_tank"`);
    await queryRunner.query(
      `ALTER TABLE "measurement" RENAME TO "temporary_measurement"`,
    );
    await queryRunner.query(
      `CREATE TABLE "measurement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "volume" float NOT NULL, "weight" float NOT NULL, "density" float NOT NULL, "temperature" float NOT NULL, "level" integer NOT NULL, "shiftId" integer, "tankId" integer, CONSTRAINT "REL_9db39d4bd115c73809964f0b81" UNIQUE ("shiftId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "measurement"("id", "createdAt", "updatedAt", "deletedAt", "volume", "weight", "density", "temperature", "level", "shiftId", "tankId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "volume", "weight", "density", "temperature", "level", "shiftId", "tankId" FROM "temporary_measurement"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_measurement"`);
    await queryRunner.query(`ALTER TABLE "shift" RENAME TO "temporary_shift"`);
    await queryRunner.query(
      `CREATE TABLE "shift" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "startedAt" integer NOT NULL, "closedAt" integer, "userId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "shift"("id", "createdAt", "updatedAt", "deletedAt", "startedAt", "closedAt", "userId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "startedAt", "closedAt", "userId" FROM "temporary_shift"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_shift"`);
    await queryRunner.query(`ALTER TABLE "event" RENAME TO "temporary_event"`);
    await queryRunner.query(
      `CREATE TABLE "event" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "name" varchar NOT NULL, "type" varchar CHECK( "type" IN ('default','create','update','delete') ) NOT NULL DEFAULT ('default'), "collection" varchar CHECK( "collection" IN ('default','operation','fuel','shift','settings') ) NOT NULL DEFAULT ('default'), "dataBefore" varchar NOT NULL, "dataAfter" varchar NOT NULL, "shiftId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "event"("id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId" FROM "temporary_event"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_event"`);
    await queryRunner.query(`DROP TABLE "driver"`);
    await queryRunner.query(`DROP TABLE "operation"`);
    await queryRunner.query(`DROP TABLE "vehicle"`);
    await queryRunner.query(`DROP TABLE "trailer"`);
    await queryRunner.query(`DROP TABLE "tank"`);
    await queryRunner.query(`DROP TABLE "refinery"`);
    await queryRunner.query(`DROP TABLE "fuel_holder"`);
    await queryRunner.query(`DROP TABLE "fuel"`);
    await queryRunner.query(`DROP TABLE "measurement"`);
    await queryRunner.query(`DROP TABLE "shift"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "event"`);
    await queryRunner.query(`DROP TABLE "dispenser"`);
  }
}
