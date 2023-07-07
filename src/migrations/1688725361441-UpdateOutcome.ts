import { MigrationInterface, QueryRunner } from 'typeorm';

/*eslint-disable*/
export class UpdateOutcome1688725361441 implements MigrationInterface {
  name = 'UpdateOutcome1688725361441';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_supply" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('PROCESS','STRAIT','SUPPLY') ) NOT NULL DEFAULT ('PROCESS'), "numberTTN" integer NOT NULL, "docVolume" float NOT NULL, "docWeight" float NOT NULL, "docDensity" float NOT NULL, "docTemperature" float NOT NULL, "factVolume" float NOT NULL, "factWeight" float NOT NULL, "factDensity" float NOT NULL, "factByTank" float NOT NULL, "differenceWeight" float NOT NULL, "volumeBefore" float NOT NULL, "volumeAfter" float NOT NULL, "levelBefore" float NOT NULL, "levelAfter" float NOT NULL, "vehicleId" integer, "tankId" integer, "shiftId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer, "driverId" integer, CONSTRAINT "FK_f9e8cae118517b0dc1c9ded7d5d" FOREIGN KEY ("refineryId") REFERENCES "refinery" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_29e4e104af3986e50b40a0e152e" FOREIGN KEY ("fuelHolderId") REFERENCES "fuel_holder" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_e4e0755fa0909eb5915a6bd66d6" FOREIGN KEY ("fuelId") REFERENCES "fuel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_67ad1d4a093b287f7fe7b21ffe7" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_2cdbd044860396c3498b6e9a145" FOREIGN KEY ("tankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_1611bfff8ef7b87a361288b94bb" FOREIGN KEY ("vehicleId") REFERENCES "vehicle" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7b8bb1f975f7935edc70c729cbf" FOREIGN KEY ("driverId") REFERENCES "driver" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_supply"("id", "createdAt", "updatedAt", "deletedAt", "type", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "factByTank", "differenceWeight", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId", "refineryId", "driverId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "factByTank", "differenceWeight", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId", "refineryId", "driverId" FROM "supply"`,
    );
    await queryRunner.query(`DROP TABLE "supply"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_supply" RENAME TO "supply"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_vehicle" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('TRUCK','LOADER') ) NOT NULL, "carModel" text NOT NULL, "regNumber" varchar NOT NULL, "tanksVolume" text NOT NULL, "tanksCalibration" text NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_vehicle"("id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "tanksVolume", "tanksCalibration", "isEnabled") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "tanksVolume", "tanksCalibration", "isEnabled" FROM "vehicle"`,
    );
    await queryRunner.query(`DROP TABLE "vehicle"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_vehicle" RENAME TO "vehicle"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_outcome" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "status" varchar CHECK( "status" IN ('PROCESS','STRAIT','SUPPLY') ) NOT NULL DEFAULT ('PROCESS'), "numberTTN" integer NOT NULL, "docVolume" float NOT NULL, "docWeight" float NOT NULL, "docDensity" float NOT NULL, "docTemperature" float NOT NULL, "factVolume" float NOT NULL, "factWeight" float NOT NULL, "factDensity" float NOT NULL, "counterBefore" float NOT NULL, "counterAfter" float NOT NULL, "volumeBefore" float NOT NULL, "volumeAfter" float NOT NULL, "dispenserId" integer, "driverId" integer, "vehicleId" integer, "tankId" integer, "shiftId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer, CONSTRAINT "FK_91f37a9d5552a9475ab2b1fb0dd" FOREIGN KEY ("refineryId") REFERENCES "refinery" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_bbd4bb31be0fa25ea8f28bdbd9c" FOREIGN KEY ("fuelHolderId") REFERENCES "fuel_holder" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_a87b40e6ca5a5b8aa38ab93619a" FOREIGN KEY ("fuelId") REFERENCES "fuel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_362310c930f0e68acdfa741ccb8" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_5bf954c48bc0723be1d669c5836" FOREIGN KEY ("tankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_8ab37ec56a4b7eda06da3163fbf" FOREIGN KEY ("vehicleId") REFERENCES "vehicle" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0daa8040fbaa10de287e6f0fc74" FOREIGN KEY ("driverId") REFERENCES "driver" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4aa68f8f77ab4cecc3bce7e6b29" FOREIGN KEY ("dispenserId") REFERENCES "dispenser" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_outcome"("id", "createdAt", "updatedAt", "deletedAt", "status", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "dispenserId", "driverId", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId", "refineryId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "status", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "dispenserId", "driverId", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId", "refineryId" FROM "outcome"`,
    );
    await queryRunner.query(`DROP TABLE "outcome"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_outcome" RENAME TO "outcome"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "role" varchar CHECK( "role" IN ('OPERATOR','ADMIN') ) NOT NULL DEFAULT ('OPERATOR'), "login" varchar NOT NULL, "password" varchar NOT NULL, "refreshToken" varchar, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_user"("id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled") SELECT "id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled" FROM "user"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_supply" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('PROCESS','STRAIT','SUPPLY') ) NOT NULL DEFAULT ('PROCESS'), "numberTTN" integer NOT NULL, "docVolume" float NOT NULL, "docWeight" float NOT NULL, "docDensity" float NOT NULL, "docTemperature" float NOT NULL, "factVolume" float NOT NULL, "factWeight" float NOT NULL, "factDensity" float NOT NULL, "factByTank" float NOT NULL, "differenceWeight" float NOT NULL, "volumeBefore" float NOT NULL, "volumeAfter" float NOT NULL, "levelBefore" float NOT NULL, "levelAfter" float NOT NULL, "vehicleId" integer, "tankId" integer, "shiftId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer, "driverId" integer, CONSTRAINT "FK_f9e8cae118517b0dc1c9ded7d5d" FOREIGN KEY ("refineryId") REFERENCES "refinery" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_29e4e104af3986e50b40a0e152e" FOREIGN KEY ("fuelHolderId") REFERENCES "fuel_holder" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_e4e0755fa0909eb5915a6bd66d6" FOREIGN KEY ("fuelId") REFERENCES "fuel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_67ad1d4a093b287f7fe7b21ffe7" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_2cdbd044860396c3498b6e9a145" FOREIGN KEY ("tankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_1611bfff8ef7b87a361288b94bb" FOREIGN KEY ("vehicleId") REFERENCES "vehicle" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7b8bb1f975f7935edc70c729cbf" FOREIGN KEY ("driverId") REFERENCES "driver" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_supply"("id", "createdAt", "updatedAt", "deletedAt", "type", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "factByTank", "differenceWeight", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId", "refineryId", "driverId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "factByTank", "differenceWeight", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId", "refineryId", "driverId" FROM "supply"`,
    );
    await queryRunner.query(`DROP TABLE "supply"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_supply" RENAME TO "supply"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_vehicle" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('TRUCK','LOADER') ) NOT NULL, "carModel" text NOT NULL, "regNumber" varchar NOT NULL, "tanksVolume" text NOT NULL, "tanksCalibration" text NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_vehicle"("id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "tanksVolume", "tanksCalibration", "isEnabled") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "tanksVolume", "tanksCalibration", "isEnabled" FROM "vehicle"`,
    );
    await queryRunner.query(`DROP TABLE "vehicle"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_vehicle" RENAME TO "vehicle"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_outcome" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "status" varchar CHECK( "status" IN ('PROCESS','STRAIT','SUPPLY') ) NOT NULL DEFAULT ('PROCESS'), "numberTTN" integer NOT NULL, "docVolume" float NOT NULL, "docWeight" float NOT NULL, "docDensity" float NOT NULL, "docTemperature" float NOT NULL, "factVolume" float NOT NULL, "factWeight" float NOT NULL, "factDensity" float NOT NULL, "counterBefore" float NOT NULL, "counterAfter" float NOT NULL, "volumeBefore" float NOT NULL, "volumeAfter" float NOT NULL, "dispenserId" integer, "driverId" integer, "vehicleId" integer, "tankId" integer, "shiftId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer, CONSTRAINT "FK_91f37a9d5552a9475ab2b1fb0dd" FOREIGN KEY ("refineryId") REFERENCES "refinery" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_bbd4bb31be0fa25ea8f28bdbd9c" FOREIGN KEY ("fuelHolderId") REFERENCES "fuel_holder" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_a87b40e6ca5a5b8aa38ab93619a" FOREIGN KEY ("fuelId") REFERENCES "fuel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_362310c930f0e68acdfa741ccb8" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_5bf954c48bc0723be1d669c5836" FOREIGN KEY ("tankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_8ab37ec56a4b7eda06da3163fbf" FOREIGN KEY ("vehicleId") REFERENCES "vehicle" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0daa8040fbaa10de287e6f0fc74" FOREIGN KEY ("driverId") REFERENCES "driver" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4aa68f8f77ab4cecc3bce7e6b29" FOREIGN KEY ("dispenserId") REFERENCES "dispenser" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_outcome"("id", "createdAt", "updatedAt", "deletedAt", "status", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "dispenserId", "driverId", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId", "refineryId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "status", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "dispenserId", "driverId", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId", "refineryId" FROM "outcome"`,
    );
    await queryRunner.query(`DROP TABLE "outcome"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_outcome" RENAME TO "outcome"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "role" varchar CHECK( "role" IN ('OPERATOR','ADMIN') ) NOT NULL DEFAULT ('OPERATOR'), "login" varchar NOT NULL, "password" varchar NOT NULL, "refreshToken" varchar, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_user"("id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled") SELECT "id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled" FROM "user"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_event" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "name" varchar NOT NULL, "type" varchar CHECK( "type" IN ('DEFAULT','CREATE','UPDATE','DELETE') ) NOT NULL DEFAULT ('DEFAULT'), "collection" varchar CHECK( "collection" IN ('DEFAULT','OUTCOME','SUPPLY','FUEL','SHIFT','SETTINGS') ) NOT NULL DEFAULT ('DEFAULT'), "dataBefore" varchar NOT NULL, "dataAfter" varchar NOT NULL, "shiftId" integer, CONSTRAINT "FK_b73505b6ca6ee9d0207ab350cfc" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_event"("id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId" FROM "event"`,
    );
    await queryRunner.query(`DROP TABLE "event"`);
    await queryRunner.query(`ALTER TABLE "temporary_event" RENAME TO "event"`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event" RENAME TO "temporary_event"`);
    await queryRunner.query(
      `CREATE TABLE "event" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "name" varchar NOT NULL, "type" varchar CHECK( "type" IN ('DEFAULT','CREATE','UPDATE','DELETE') ) NOT NULL DEFAULT ('DEFAULT'), "collection" varchar CHECK( "collection" IN ('DEFAULT','OUTCOME','SUPPLY','FUEL','SHIFT','SETTINGS') ) NOT NULL DEFAULT ('DEFAULT'), "dataBefore" varchar NOT NULL, "dataAfter" varchar NOT NULL, "shiftId" integer, CONSTRAINT "FK_b73505b6ca6ee9d0207ab350cfc" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "event"("id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId" FROM "temporary_event"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_event"`);
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "role" varchar CHECK( "role" IN ('OPERATOR','ADMIN') ) NOT NULL DEFAULT ('OPERATOR'), "login" varchar NOT NULL, "password" varchar NOT NULL, "refreshToken" varchar, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `INSERT INTO "user"("id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled") SELECT "id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled" FROM "temporary_user"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_user"`);
    await queryRunner.query(
      `ALTER TABLE "outcome" RENAME TO "temporary_outcome"`,
    );
    await queryRunner.query(
      `CREATE TABLE "outcome" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "status" varchar CHECK( "status" IN ('PROCESS','STRAIT','SUPPLY') ) NOT NULL DEFAULT ('PROCESS'), "numberTTN" integer NOT NULL, "docVolume" float NOT NULL, "docWeight" float NOT NULL, "docDensity" float NOT NULL, "docTemperature" float NOT NULL, "factVolume" float NOT NULL, "factWeight" float NOT NULL, "factDensity" float NOT NULL, "counterBefore" float NOT NULL, "counterAfter" float NOT NULL, "volumeBefore" float NOT NULL, "volumeAfter" float NOT NULL, "dispenserId" integer, "driverId" integer, "vehicleId" integer, "tankId" integer, "shiftId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer, CONSTRAINT "FK_91f37a9d5552a9475ab2b1fb0dd" FOREIGN KEY ("refineryId") REFERENCES "refinery" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_bbd4bb31be0fa25ea8f28bdbd9c" FOREIGN KEY ("fuelHolderId") REFERENCES "fuel_holder" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_a87b40e6ca5a5b8aa38ab93619a" FOREIGN KEY ("fuelId") REFERENCES "fuel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_362310c930f0e68acdfa741ccb8" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_5bf954c48bc0723be1d669c5836" FOREIGN KEY ("tankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_8ab37ec56a4b7eda06da3163fbf" FOREIGN KEY ("vehicleId") REFERENCES "vehicle" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0daa8040fbaa10de287e6f0fc74" FOREIGN KEY ("driverId") REFERENCES "driver" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4aa68f8f77ab4cecc3bce7e6b29" FOREIGN KEY ("dispenserId") REFERENCES "dispenser" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "outcome"("id", "createdAt", "updatedAt", "deletedAt", "status", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "dispenserId", "driverId", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId", "refineryId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "status", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "dispenserId", "driverId", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId", "refineryId" FROM "temporary_outcome"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_outcome"`);
    await queryRunner.query(
      `ALTER TABLE "vehicle" RENAME TO "temporary_vehicle"`,
    );
    await queryRunner.query(
      `CREATE TABLE "vehicle" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('TRUCK','LOADER') ) NOT NULL, "carModel" text NOT NULL, "regNumber" varchar NOT NULL, "tanksVolume" text NOT NULL, "tanksCalibration" text NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `INSERT INTO "vehicle"("id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "tanksVolume", "tanksCalibration", "isEnabled") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "tanksVolume", "tanksCalibration", "isEnabled" FROM "temporary_vehicle"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_vehicle"`);
    await queryRunner.query(
      `ALTER TABLE "supply" RENAME TO "temporary_supply"`,
    );
    await queryRunner.query(
      `CREATE TABLE "supply" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('PROCESS','STRAIT','SUPPLY') ) NOT NULL DEFAULT ('PROCESS'), "numberTTN" integer NOT NULL, "docVolume" float NOT NULL, "docWeight" float NOT NULL, "docDensity" float NOT NULL, "docTemperature" float NOT NULL, "factVolume" float NOT NULL, "factWeight" float NOT NULL, "factDensity" float NOT NULL, "factByTank" float NOT NULL, "differenceWeight" float NOT NULL, "volumeBefore" float NOT NULL, "volumeAfter" float NOT NULL, "levelBefore" float NOT NULL, "levelAfter" float NOT NULL, "vehicleId" integer, "tankId" integer, "shiftId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer, "driverId" integer, CONSTRAINT "FK_f9e8cae118517b0dc1c9ded7d5d" FOREIGN KEY ("refineryId") REFERENCES "refinery" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_29e4e104af3986e50b40a0e152e" FOREIGN KEY ("fuelHolderId") REFERENCES "fuel_holder" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_e4e0755fa0909eb5915a6bd66d6" FOREIGN KEY ("fuelId") REFERENCES "fuel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_67ad1d4a093b287f7fe7b21ffe7" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_2cdbd044860396c3498b6e9a145" FOREIGN KEY ("tankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_1611bfff8ef7b87a361288b94bb" FOREIGN KEY ("vehicleId") REFERENCES "vehicle" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7b8bb1f975f7935edc70c729cbf" FOREIGN KEY ("driverId") REFERENCES "driver" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "supply"("id", "createdAt", "updatedAt", "deletedAt", "type", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "factByTank", "differenceWeight", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId", "refineryId", "driverId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "factByTank", "differenceWeight", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId", "refineryId", "driverId" FROM "temporary_supply"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_supply"`);
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "role" varchar CHECK( "role" IN ('OPERATOR','ADMIN') ) NOT NULL DEFAULT ('OPERATOR'), "login" varchar NOT NULL, "password" varchar NOT NULL, "refreshToken" varchar, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `INSERT INTO "user"("id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled") SELECT "id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled" FROM "temporary_user"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_user"`);
    await queryRunner.query(
      `ALTER TABLE "outcome" RENAME TO "temporary_outcome"`,
    );
    await queryRunner.query(
      `CREATE TABLE "outcome" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "status" varchar CHECK( "status" IN ('PROCESS','STRAIT','SUPPLY') ) NOT NULL DEFAULT ('PROCESS'), "numberTTN" integer NOT NULL, "docVolume" float NOT NULL, "docWeight" float NOT NULL, "docDensity" float NOT NULL, "docTemperature" float NOT NULL, "factVolume" float NOT NULL, "factWeight" float NOT NULL, "factDensity" float NOT NULL, "counterBefore" float NOT NULL, "counterAfter" float NOT NULL, "volumeBefore" float NOT NULL, "volumeAfter" float NOT NULL, "dispenserId" integer, "driverId" integer, "vehicleId" integer, "tankId" integer, "shiftId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer, CONSTRAINT "FK_91f37a9d5552a9475ab2b1fb0dd" FOREIGN KEY ("refineryId") REFERENCES "refinery" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_bbd4bb31be0fa25ea8f28bdbd9c" FOREIGN KEY ("fuelHolderId") REFERENCES "fuel_holder" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_a87b40e6ca5a5b8aa38ab93619a" FOREIGN KEY ("fuelId") REFERENCES "fuel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_362310c930f0e68acdfa741ccb8" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_5bf954c48bc0723be1d669c5836" FOREIGN KEY ("tankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_8ab37ec56a4b7eda06da3163fbf" FOREIGN KEY ("vehicleId") REFERENCES "vehicle" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0daa8040fbaa10de287e6f0fc74" FOREIGN KEY ("driverId") REFERENCES "driver" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4aa68f8f77ab4cecc3bce7e6b29" FOREIGN KEY ("dispenserId") REFERENCES "dispenser" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "outcome"("id", "createdAt", "updatedAt", "deletedAt", "status", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "dispenserId", "driverId", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId", "refineryId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "status", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "dispenserId", "driverId", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId", "refineryId" FROM "temporary_outcome"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_outcome"`);
    await queryRunner.query(
      `ALTER TABLE "vehicle" RENAME TO "temporary_vehicle"`,
    );
    await queryRunner.query(
      `CREATE TABLE "vehicle" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('TRUCK','LOADER') ) NOT NULL, "carModel" text NOT NULL, "regNumber" varchar NOT NULL, "tanksVolume" text NOT NULL, "tanksCalibration" text NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `INSERT INTO "vehicle"("id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "tanksVolume", "tanksCalibration", "isEnabled") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "tanksVolume", "tanksCalibration", "isEnabled" FROM "temporary_vehicle"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_vehicle"`);
    await queryRunner.query(
      `ALTER TABLE "supply" RENAME TO "temporary_supply"`,
    );
    await queryRunner.query(
      `CREATE TABLE "supply" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('PROCESS','STRAIT','SUPPLY') ) NOT NULL DEFAULT ('PROCESS'), "numberTTN" integer NOT NULL, "docVolume" float NOT NULL, "docWeight" float NOT NULL, "docDensity" float NOT NULL, "docTemperature" float NOT NULL, "factVolume" float NOT NULL, "factWeight" float NOT NULL, "factDensity" float NOT NULL, "factByTank" float NOT NULL, "differenceWeight" float NOT NULL, "volumeBefore" float NOT NULL, "volumeAfter" float NOT NULL, "levelBefore" float NOT NULL, "levelAfter" float NOT NULL, "vehicleId" integer, "tankId" integer, "shiftId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer, "driverId" integer, CONSTRAINT "FK_f9e8cae118517b0dc1c9ded7d5d" FOREIGN KEY ("refineryId") REFERENCES "refinery" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_29e4e104af3986e50b40a0e152e" FOREIGN KEY ("fuelHolderId") REFERENCES "fuel_holder" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_e4e0755fa0909eb5915a6bd66d6" FOREIGN KEY ("fuelId") REFERENCES "fuel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_67ad1d4a093b287f7fe7b21ffe7" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_2cdbd044860396c3498b6e9a145" FOREIGN KEY ("tankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_1611bfff8ef7b87a361288b94bb" FOREIGN KEY ("vehicleId") REFERENCES "vehicle" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7b8bb1f975f7935edc70c729cbf" FOREIGN KEY ("driverId") REFERENCES "driver" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "supply"("id", "createdAt", "updatedAt", "deletedAt", "type", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "factByTank", "differenceWeight", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId", "refineryId", "driverId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "factByTank", "differenceWeight", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId", "refineryId", "driverId" FROM "temporary_supply"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_supply"`);
  }
}
