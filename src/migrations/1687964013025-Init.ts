import { MigrationInterface, QueryRunner } from 'typeorm';

/* eslint-disable max-len */
export class Init1687964013025 implements MigrationInterface {
  name = 'Init1687964013025';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "dispenser" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "sortIndex" integer NOT NULL, "currentCounter" float NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `CREATE TABLE "driver" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "firstName" varchar NOT NULL, "middleName" varchar, "lastName" varchar NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "fullName" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "measurement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "volume" float NOT NULL, "weight" float NOT NULL, "density" float NOT NULL, "temperature" float NOT NULL, "level" integer NOT NULL, "shiftId" integer, "tankId" integer, CONSTRAINT "REL_9db39d4bd115c73809964f0b81" UNIQUE ("shiftId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "fuel" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "name" varchar NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "tankId" integer, "outcomeId" integer, "supplyId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "fuel_holder" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "fullName" varchar NOT NULL, "shortName" varchar, "isEnabled" boolean NOT NULL DEFAULT (1), "tankId" integer, "outcomeId" integer, "supplyId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "refinery" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "fullName" varchar NOT NULL, "shortName" varchar, "isEnabled" boolean NOT NULL DEFAULT (1), "tankId" integer, "supplyId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "tank" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "activeFuel" varchar CHECK( "activeFuel" IN ('PETROL') ) NOT NULL DEFAULT ('PETROL'), "sortIndex" integer NOT NULL, "calibrationTable" float NOT NULL, "totalVolume" float NOT NULL, "deathBalance" float NOT NULL, "temperature" float NOT NULL, "volume" float NOT NULL, "weight" float NOT NULL, "density" float NOT NULL, "level" integer NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `CREATE TABLE "supply" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "driverName" varchar NOT NULL, "type" varchar CHECK( "type" IN ('PROCESS') ) NOT NULL DEFAULT ('PROCESS'), "numberTTN" integer NOT NULL, "docVolume" float NOT NULL, "docWeight" float NOT NULL, "docDensity" float NOT NULL, "docTemperature" float NOT NULL, "factVolume" float NOT NULL, "factWeight" float NOT NULL, "factDensity" float NOT NULL, "factByTank" float NOT NULL, "differenceWeight" float NOT NULL, "volumeBefore" float NOT NULL, "volumeAfter" float NOT NULL, "levelBefore" float NOT NULL, "levelAfter" float NOT NULL, "vehicleId" integer, "tankId" integer, "shiftId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "vehicle" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "type" varchar CHECK( "type" IN ('TRUCK') ) NOT NULL DEFAULT ('TRUCK'), "carModel" varchar CHECK( "carModel" IN ('UNKNOWN') ) NOT NULL DEFAULT ('UNKNOWN'), "regNumber" varchar NOT NULL, "tanksVolume" text NOT NULL, "tanksCalibration" text NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `CREATE TABLE "outcome" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "status" varchar CHECK( "status" IN ('PROCESS') ) NOT NULL DEFAULT ('PROCESS'), "numberTTN" integer NOT NULL, "docVolume" float NOT NULL, "docWeight" float NOT NULL, "docDensity" float NOT NULL, "docTemperature" float NOT NULL, "factVolume" float NOT NULL, "factWeight" float NOT NULL, "factDensity" float NOT NULL, "counterBefore" float NOT NULL, "counterAfter" float NOT NULL, "volumeBefore" float NOT NULL, "volumeAfter" float NOT NULL, "dispenserId" integer, "driverId" integer, "vehicleId" integer, "tankId" integer, "shiftId" integer, "fuelId" integer, "fuelHolderId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "role" varchar CHECK( "role" IN ('USER','ADMIN') ) NOT NULL DEFAULT ('USER'), "login" varchar NOT NULL, "password" varchar NOT NULL, "refreshToken" varchar, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `CREATE TABLE "shift" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "startedAt" integer NOT NULL, "closedAt" integer NOT NULL, "userId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "event" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "name" varchar NOT NULL, "type" varchar CHECK( "type" IN ('DEFAULT','CREATE','UPDATE','DELETE') ) NOT NULL DEFAULT ('DEFAULT'), "collection" varchar CHECK( "collection" IN ('DEFAULT','OUTCOME','SUPPLY','FUEL','SHIFT','SETTINGS') ) NOT NULL DEFAULT ('DEFAULT'), "dataBefore" varchar NOT NULL, "dataAfter" varchar NOT NULL, "shiftId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_measurement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "volume" float NOT NULL, "weight" float NOT NULL, "density" float NOT NULL, "temperature" float NOT NULL, "level" integer NOT NULL, "shiftId" integer, "tankId" integer, CONSTRAINT "REL_9db39d4bd115c73809964f0b81" UNIQUE ("shiftId"), CONSTRAINT "FK_9db39d4bd115c73809964f0b81f" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_92f5563f093215be4ca1005b0ac" FOREIGN KEY ("tankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_measurement"("id", "createdAt", "updatedAt", "deletedAt", "volume", "weight", "density", "temperature", "level", "shiftId", "tankId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "volume", "weight", "density", "temperature", "level", "shiftId", "tankId" FROM "measurement"`,
    );
    await queryRunner.query(`DROP TABLE "measurement"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_measurement" RENAME TO "measurement"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_fuel" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "name" varchar NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "tankId" integer, "outcomeId" integer, "supplyId" integer, CONSTRAINT "FK_18e51f26062bfa12754566ad87a" FOREIGN KEY ("tankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7c394956bd9e93d0990c8d5ec63" FOREIGN KEY ("outcomeId") REFERENCES "outcome" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_e1207e159312382a885b555ee2c" FOREIGN KEY ("supplyId") REFERENCES "supply" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_fuel"("id", "createdAt", "updatedAt", "deletedAt", "name", "isEnabled", "tankId", "outcomeId", "supplyId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "name", "isEnabled", "tankId", "outcomeId", "supplyId" FROM "fuel"`,
    );
    await queryRunner.query(`DROP TABLE "fuel"`);
    await queryRunner.query(`ALTER TABLE "temporary_fuel" RENAME TO "fuel"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_fuel_holder" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "fullName" varchar NOT NULL, "shortName" varchar, "isEnabled" boolean NOT NULL DEFAULT (1), "tankId" integer, "outcomeId" integer, "supplyId" integer, CONSTRAINT "FK_cb08444843e7f1717b7167200d1" FOREIGN KEY ("tankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_f9db4e3c395ffadd66b09bba4e9" FOREIGN KEY ("outcomeId") REFERENCES "outcome" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_cd53f6662f6e0a3143e76ca29ad" FOREIGN KEY ("supplyId") REFERENCES "supply" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_fuel_holder"("id", "createdAt", "updatedAt", "deletedAt", "fullName", "shortName", "isEnabled", "tankId", "outcomeId", "supplyId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "fullName", "shortName", "isEnabled", "tankId", "outcomeId", "supplyId" FROM "fuel_holder"`,
    );
    await queryRunner.query(`DROP TABLE "fuel_holder"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_fuel_holder" RENAME TO "fuel_holder"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_refinery" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "fullName" varchar NOT NULL, "shortName" varchar, "isEnabled" boolean NOT NULL DEFAULT (1), "tankId" integer, "supplyId" integer, CONSTRAINT "FK_cde26dfce75e1ab46291eb28b7e" FOREIGN KEY ("tankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_bf57dbe99ffcd1ee20c579d12ef" FOREIGN KEY ("supplyId") REFERENCES "supply" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_refinery"("id", "createdAt", "updatedAt", "deletedAt", "fullName", "shortName", "isEnabled", "tankId", "supplyId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "fullName", "shortName", "isEnabled", "tankId", "supplyId" FROM "refinery"`,
    );
    await queryRunner.query(`DROP TABLE "refinery"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_refinery" RENAME TO "refinery"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_supply" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "driverName" varchar NOT NULL, "type" varchar CHECK( "type" IN ('PROCESS') ) NOT NULL DEFAULT ('PROCESS'), "numberTTN" integer NOT NULL, "docVolume" float NOT NULL, "docWeight" float NOT NULL, "docDensity" float NOT NULL, "docTemperature" float NOT NULL, "factVolume" float NOT NULL, "factWeight" float NOT NULL, "factDensity" float NOT NULL, "factByTank" float NOT NULL, "differenceWeight" float NOT NULL, "volumeBefore" float NOT NULL, "volumeAfter" float NOT NULL, "levelBefore" float NOT NULL, "levelAfter" float NOT NULL, "vehicleId" integer, "tankId" integer, "shiftId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer, CONSTRAINT "FK_1611bfff8ef7b87a361288b94bb" FOREIGN KEY ("vehicleId") REFERENCES "vehicle" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_2cdbd044860396c3498b6e9a145" FOREIGN KEY ("tankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_67ad1d4a093b287f7fe7b21ffe7" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_e4e0755fa0909eb5915a6bd66d6" FOREIGN KEY ("fuelId") REFERENCES "fuel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_29e4e104af3986e50b40a0e152e" FOREIGN KEY ("fuelHolderId") REFERENCES "fuel_holder" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_f9e8cae118517b0dc1c9ded7d5d" FOREIGN KEY ("refineryId") REFERENCES "refinery" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_supply"("id", "createdAt", "updatedAt", "deletedAt", "driverName", "type", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "factByTank", "differenceWeight", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId", "refineryId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "driverName", "type", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "factByTank", "differenceWeight", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId", "refineryId" FROM "supply"`,
    );
    await queryRunner.query(`DROP TABLE "supply"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_supply" RENAME TO "supply"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_outcome" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "status" varchar CHECK( "status" IN ('PROCESS') ) NOT NULL DEFAULT ('PROCESS'), "numberTTN" integer NOT NULL, "docVolume" float NOT NULL, "docWeight" float NOT NULL, "docDensity" float NOT NULL, "docTemperature" float NOT NULL, "factVolume" float NOT NULL, "factWeight" float NOT NULL, "factDensity" float NOT NULL, "counterBefore" float NOT NULL, "counterAfter" float NOT NULL, "volumeBefore" float NOT NULL, "volumeAfter" float NOT NULL, "dispenserId" integer, "driverId" integer, "vehicleId" integer, "tankId" integer, "shiftId" integer, "fuelId" integer, "fuelHolderId" integer, CONSTRAINT "FK_4aa68f8f77ab4cecc3bce7e6b29" FOREIGN KEY ("dispenserId") REFERENCES "dispenser" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0daa8040fbaa10de287e6f0fc74" FOREIGN KEY ("driverId") REFERENCES "driver" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_8ab37ec56a4b7eda06da3163fbf" FOREIGN KEY ("vehicleId") REFERENCES "vehicle" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_5bf954c48bc0723be1d669c5836" FOREIGN KEY ("tankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_362310c930f0e68acdfa741ccb8" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_a87b40e6ca5a5b8aa38ab93619a" FOREIGN KEY ("fuelId") REFERENCES "fuel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_bbd4bb31be0fa25ea8f28bdbd9c" FOREIGN KEY ("fuelHolderId") REFERENCES "fuel_holder" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_outcome"("id", "createdAt", "updatedAt", "deletedAt", "status", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "dispenserId", "driverId", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "status", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "dispenserId", "driverId", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId" FROM "outcome"`,
    );
    await queryRunner.query(`DROP TABLE "outcome"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_outcome" RENAME TO "outcome"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_shift" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "startedAt" integer NOT NULL, "closedAt" integer NOT NULL, "userId" integer, CONSTRAINT "FK_d6c3886ef9888f23e6d995d2640" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_shift"("id", "createdAt", "updatedAt", "deletedAt", "startedAt", "closedAt", "userId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "startedAt", "closedAt", "userId" FROM "shift"`,
    );
    await queryRunner.query(`DROP TABLE "shift"`);
    await queryRunner.query(`ALTER TABLE "temporary_shift" RENAME TO "shift"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_event" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "name" varchar NOT NULL, "type" varchar CHECK( "type" IN ('DEFAULT','CREATE','UPDATE','DELETE') ) NOT NULL DEFAULT ('DEFAULT'), "collection" varchar CHECK( "collection" IN ('DEFAULT','OUTCOME','SUPPLY','FUEL','SHIFT','SETTINGS') ) NOT NULL DEFAULT ('DEFAULT'), "dataBefore" varchar NOT NULL, "dataAfter" varchar NOT NULL, "shiftId" integer, CONSTRAINT "FK_b73505b6ca6ee9d0207ab350cfc" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
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
      `CREATE TABLE "event" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "name" varchar NOT NULL, "type" varchar CHECK( "type" IN ('DEFAULT','CREATE','UPDATE','DELETE') ) NOT NULL DEFAULT ('DEFAULT'), "collection" varchar CHECK( "collection" IN ('DEFAULT','OUTCOME','SUPPLY','FUEL','SHIFT','SETTINGS') ) NOT NULL DEFAULT ('DEFAULT'), "dataBefore" varchar NOT NULL, "dataAfter" varchar NOT NULL, "shiftId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "event"("id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId" FROM "temporary_event"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_event"`);
    await queryRunner.query(`ALTER TABLE "shift" RENAME TO "temporary_shift"`);
    await queryRunner.query(
      `CREATE TABLE "shift" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "startedAt" integer NOT NULL, "closedAt" integer NOT NULL, "userId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "shift"("id", "createdAt", "updatedAt", "deletedAt", "startedAt", "closedAt", "userId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "startedAt", "closedAt", "userId" FROM "temporary_shift"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_shift"`);
    await queryRunner.query(
      `ALTER TABLE "outcome" RENAME TO "temporary_outcome"`,
    );
    await queryRunner.query(
      `CREATE TABLE "outcome" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "status" varchar CHECK( "status" IN ('PROCESS') ) NOT NULL DEFAULT ('PROCESS'), "numberTTN" integer NOT NULL, "docVolume" float NOT NULL, "docWeight" float NOT NULL, "docDensity" float NOT NULL, "docTemperature" float NOT NULL, "factVolume" float NOT NULL, "factWeight" float NOT NULL, "factDensity" float NOT NULL, "counterBefore" float NOT NULL, "counterAfter" float NOT NULL, "volumeBefore" float NOT NULL, "volumeAfter" float NOT NULL, "dispenserId" integer, "driverId" integer, "vehicleId" integer, "tankId" integer, "shiftId" integer, "fuelId" integer, "fuelHolderId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "outcome"("id", "createdAt", "updatedAt", "deletedAt", "status", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "dispenserId", "driverId", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "status", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "dispenserId", "driverId", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId" FROM "temporary_outcome"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_outcome"`);
    await queryRunner.query(
      `ALTER TABLE "supply" RENAME TO "temporary_supply"`,
    );
    await queryRunner.query(
      `CREATE TABLE "supply" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "driverName" varchar NOT NULL, "type" varchar CHECK( "type" IN ('PROCESS') ) NOT NULL DEFAULT ('PROCESS'), "numberTTN" integer NOT NULL, "docVolume" float NOT NULL, "docWeight" float NOT NULL, "docDensity" float NOT NULL, "docTemperature" float NOT NULL, "factVolume" float NOT NULL, "factWeight" float NOT NULL, "factDensity" float NOT NULL, "factByTank" float NOT NULL, "differenceWeight" float NOT NULL, "volumeBefore" float NOT NULL, "volumeAfter" float NOT NULL, "levelBefore" float NOT NULL, "levelAfter" float NOT NULL, "vehicleId" integer, "tankId" integer, "shiftId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "supply"("id", "createdAt", "updatedAt", "deletedAt", "driverName", "type", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "factByTank", "differenceWeight", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId", "refineryId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "driverName", "type", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "factByTank", "differenceWeight", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId", "refineryId" FROM "temporary_supply"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_supply"`);
    await queryRunner.query(
      `ALTER TABLE "refinery" RENAME TO "temporary_refinery"`,
    );
    await queryRunner.query(
      `CREATE TABLE "refinery" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "fullName" varchar NOT NULL, "shortName" varchar, "isEnabled" boolean NOT NULL DEFAULT (1), "tankId" integer, "supplyId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "refinery"("id", "createdAt", "updatedAt", "deletedAt", "fullName", "shortName", "isEnabled", "tankId", "supplyId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "fullName", "shortName", "isEnabled", "tankId", "supplyId" FROM "temporary_refinery"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_refinery"`);
    await queryRunner.query(
      `ALTER TABLE "fuel_holder" RENAME TO "temporary_fuel_holder"`,
    );
    await queryRunner.query(
      `CREATE TABLE "fuel_holder" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "fullName" varchar NOT NULL, "shortName" varchar, "isEnabled" boolean NOT NULL DEFAULT (1), "tankId" integer, "outcomeId" integer, "supplyId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "fuel_holder"("id", "createdAt", "updatedAt", "deletedAt", "fullName", "shortName", "isEnabled", "tankId", "outcomeId", "supplyId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "fullName", "shortName", "isEnabled", "tankId", "outcomeId", "supplyId" FROM "temporary_fuel_holder"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_fuel_holder"`);
    await queryRunner.query(`ALTER TABLE "fuel" RENAME TO "temporary_fuel"`);
    await queryRunner.query(
      `CREATE TABLE "fuel" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "name" varchar NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "tankId" integer, "outcomeId" integer, "supplyId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "fuel"("id", "createdAt", "updatedAt", "deletedAt", "name", "isEnabled", "tankId", "outcomeId", "supplyId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "name", "isEnabled", "tankId", "outcomeId", "supplyId" FROM "temporary_fuel"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_fuel"`);
    await queryRunner.query(
      `ALTER TABLE "measurement" RENAME TO "temporary_measurement"`,
    );
    await queryRunner.query(
      `CREATE TABLE "measurement" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (datetime('now')), "updatedAt" integer NOT NULL DEFAULT (datetime('now')), "deletedAt" integer, "volume" float NOT NULL, "weight" float NOT NULL, "density" float NOT NULL, "temperature" float NOT NULL, "level" integer NOT NULL, "shiftId" integer, "tankId" integer, CONSTRAINT "REL_9db39d4bd115c73809964f0b81" UNIQUE ("shiftId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "measurement"("id", "createdAt", "updatedAt", "deletedAt", "volume", "weight", "density", "temperature", "level", "shiftId", "tankId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "volume", "weight", "density", "temperature", "level", "shiftId", "tankId" FROM "temporary_measurement"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_measurement"`);
    await queryRunner.query(`DROP TABLE "event"`);
    await queryRunner.query(`DROP TABLE "shift"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "outcome"`);
    await queryRunner.query(`DROP TABLE "vehicle"`);
    await queryRunner.query(`DROP TABLE "supply"`);
    await queryRunner.query(`DROP TABLE "tank"`);
    await queryRunner.query(`DROP TABLE "refinery"`);
    await queryRunner.query(`DROP TABLE "fuel_holder"`);
    await queryRunner.query(`DROP TABLE "fuel"`);
    await queryRunner.query(`DROP TABLE "measurement"`);
    await queryRunner.query(`DROP TABLE "driver"`);
    await queryRunner.query(`DROP TABLE "dispenser"`);
  }
}
