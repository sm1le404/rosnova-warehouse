import { MigrationInterface, QueryRunner } from 'typeorm';

/*eslint-disable*/
export class AddOperationTable1689662243276 implements MigrationInterface {
  name = 'AddOperationTable1689662243276';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_vehicle" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('TRUCK','LOADER') ) NOT NULL, "carModel" text NOT NULL, "regNumber" varchar NOT NULL, "tanksVolume" text NOT NULL, "tanksCalibration" text NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "vehicleState" text NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_vehicle"("id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "tanksVolume", "tanksCalibration", "isEnabled", "vehicleState") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "tanksVolume", "tanksCalibration", "isEnabled", "vehicleState" FROM "vehicle"`,
    );
    await queryRunner.query(`DROP TABLE "vehicle"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_vehicle" RENAME TO "vehicle"`,
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
      `CREATE TABLE "temporary_vehicle" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('TRUCK','LOADER') ) NOT NULL, "carModel" text NOT NULL, "regNumber" varchar NOT NULL, "tanksVolume" text NOT NULL, "tanksCalibration" text NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "vehicleState" text NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_vehicle"("id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "tanksVolume", "tanksCalibration", "isEnabled", "vehicleState") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "tanksVolume", "tanksCalibration", "isEnabled", "vehicleState" FROM "vehicle"`,
    );
    await queryRunner.query(`DROP TABLE "vehicle"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_vehicle" RENAME TO "vehicle"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_event" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "name" varchar NOT NULL, "type" varchar CHECK( "type" IN ('DEFAULT','CREATE','UPDATE','DELETE') ) NOT NULL DEFAULT ('DEFAULT'), "collection" varchar CHECK( "collection" IN ('DEFAULT','OUTCOME','SUPPLY','FUEL','SHIFT','SETTINGS') ) NOT NULL DEFAULT ('DEFAULT'), "dataBefore" varchar NOT NULL, "dataAfter" varchar NOT NULL, "shiftId" integer, CONSTRAINT "FK_b73505b6ca6ee9d0207ab350cfc" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_event"("id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId" FROM "event"`,
    );
    await queryRunner.query(`DROP TABLE "event"`);
    await queryRunner.query(`ALTER TABLE "temporary_event" RENAME TO "event"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "role" varchar CHECK( "role" IN ('OPERATOR','ADMIN') ) NOT NULL DEFAULT ('OPERATOR'), "login" varchar NOT NULL, "password" varchar NOT NULL, "refreshToken" varchar, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_user"("id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled") SELECT "id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled" FROM "user"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_operation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('outcome','supply','strait','return') ) NOT NULL, "status" varchar CHECK( "status" IN ('created','started','progress','interrupted','stopped','finished') ) NOT NULL DEFAULT ('created'), "vehicleState" text NOT NULL, "numberTTN" integer NOT NULL, "docVolume" float NOT NULL, "docWeight" float NOT NULL, "docDensity" float NOT NULL, "docTemperature" float NOT NULL, "factVolume" float NOT NULL, "factWeight" float NOT NULL, "factDensity" float NOT NULL, "counterBefore" float DEFAULT (0), "counterAfter" float DEFAULT (0), "volumeBefore" float DEFAULT (0), "volumeAfter" float DEFAULT (0), "factByTank" float NOT NULL, "differenceWeight" float NOT NULL, "levelBefore" float DEFAULT (0), "levelAfter" float DEFAULT (0), "dispenserId" integer, "driverId" integer, "vehicleId" integer, "tankId" integer, "shiftId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer, CONSTRAINT "FK_4fa6456e8465dc3738f18ade562" FOREIGN KEY ("refineryId") REFERENCES "refinery" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_2a95009217197ba57060423fc00" FOREIGN KEY ("fuelHolderId") REFERENCES "fuel_holder" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_1ec7313173df4fe9b3d0cd9ff56" FOREIGN KEY ("fuelId") REFERENCES "fuel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0fe8d164f8e00199fff3a1ab00e" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7c627c969c9eeccceb4b290806c" FOREIGN KEY ("tankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_289c58cdde3f9e5e7d1c9111b6f" FOREIGN KEY ("vehicleId") REFERENCES "vehicle" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4fe00161ef48138bfa3f434d1e2" FOREIGN KEY ("driverId") REFERENCES "driver" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_44a506978936572278194b22c22" FOREIGN KEY ("dispenserId") REFERENCES "dispenser" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_operation"("id", "createdAt", "updatedAt", "deletedAt", "type", "status", "vehicleState", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "factByTank", "differenceWeight", "levelBefore", "levelAfter", "dispenserId", "driverId", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId", "refineryId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "status", "vehicleState", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "factByTank", "differenceWeight", "levelBefore", "levelAfter", "dispenserId", "driverId", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId", "refineryId" FROM "operation"`,
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
      `CREATE TABLE "operation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('outcome','supply','strait','return') ) NOT NULL, "status" varchar CHECK( "status" IN ('created','started','progress','interrupted','stopped','finished') ) NOT NULL DEFAULT ('created'), "vehicleState" text NOT NULL, "numberTTN" integer NOT NULL, "docVolume" float NOT NULL, "docWeight" float NOT NULL, "docDensity" float NOT NULL, "docTemperature" float NOT NULL, "factVolume" float NOT NULL, "factWeight" float NOT NULL, "factDensity" float NOT NULL, "counterBefore" float DEFAULT (0), "counterAfter" float DEFAULT (0), "volumeBefore" float DEFAULT (0), "volumeAfter" float DEFAULT (0), "factByTank" float NOT NULL, "differenceWeight" float NOT NULL, "levelBefore" float DEFAULT (0), "levelAfter" float DEFAULT (0), "dispenserId" integer, "driverId" integer, "vehicleId" integer, "tankId" integer, "shiftId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer, CONSTRAINT "FK_4fa6456e8465dc3738f18ade562" FOREIGN KEY ("refineryId") REFERENCES "refinery" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_2a95009217197ba57060423fc00" FOREIGN KEY ("fuelHolderId") REFERENCES "fuel_holder" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_1ec7313173df4fe9b3d0cd9ff56" FOREIGN KEY ("fuelId") REFERENCES "fuel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0fe8d164f8e00199fff3a1ab00e" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7c627c969c9eeccceb4b290806c" FOREIGN KEY ("tankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_289c58cdde3f9e5e7d1c9111b6f" FOREIGN KEY ("vehicleId") REFERENCES "vehicle" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4fe00161ef48138bfa3f434d1e2" FOREIGN KEY ("driverId") REFERENCES "driver" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_44a506978936572278194b22c22" FOREIGN KEY ("dispenserId") REFERENCES "dispenser" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "operation"("id", "createdAt", "updatedAt", "deletedAt", "type", "status", "vehicleState", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "factByTank", "differenceWeight", "levelBefore", "levelAfter", "dispenserId", "driverId", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId", "refineryId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "status", "vehicleState", "numberTTN", "docVolume", "docWeight", "docDensity", "docTemperature", "factVolume", "factWeight", "factDensity", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "factByTank", "differenceWeight", "levelBefore", "levelAfter", "dispenserId", "driverId", "vehicleId", "tankId", "shiftId", "fuelId", "fuelHolderId", "refineryId" FROM "temporary_operation"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_operation"`);
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "role" varchar CHECK( "role" IN ('OPERATOR','ADMIN') ) NOT NULL DEFAULT ('OPERATOR'), "login" varchar NOT NULL, "password" varchar NOT NULL, "refreshToken" varchar, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `INSERT INTO "user"("id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled") SELECT "id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled" FROM "temporary_user"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_user"`);
    await queryRunner.query(`ALTER TABLE "event" RENAME TO "temporary_event"`);
    await queryRunner.query(
      `CREATE TABLE "event" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "name" varchar NOT NULL, "type" varchar CHECK( "type" IN ('DEFAULT','CREATE','UPDATE','DELETE') ) NOT NULL DEFAULT ('DEFAULT'), "collection" varchar CHECK( "collection" IN ('DEFAULT','OUTCOME','SUPPLY','FUEL','SHIFT','SETTINGS') ) NOT NULL DEFAULT ('DEFAULT'), "dataBefore" varchar NOT NULL, "dataAfter" varchar NOT NULL, "shiftId" integer, CONSTRAINT "FK_b73505b6ca6ee9d0207ab350cfc" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "event"("id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId" FROM "temporary_event"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_event"`);
    await queryRunner.query(
      `ALTER TABLE "vehicle" RENAME TO "temporary_vehicle"`,
    );
    await queryRunner.query(
      `CREATE TABLE "vehicle" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('TRUCK','LOADER') ) NOT NULL, "carModel" text NOT NULL, "regNumber" varchar NOT NULL, "tanksVolume" text NOT NULL, "tanksCalibration" text NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "vehicleState" text NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "vehicle"("id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "tanksVolume", "tanksCalibration", "isEnabled", "vehicleState") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "tanksVolume", "tanksCalibration", "isEnabled", "vehicleState" FROM "temporary_vehicle"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_vehicle"`);
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "role" varchar CHECK( "role" IN ('OPERATOR','ADMIN') ) NOT NULL DEFAULT ('OPERATOR'), "login" varchar NOT NULL, "password" varchar NOT NULL, "refreshToken" varchar, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `INSERT INTO "user"("id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled") SELECT "id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled" FROM "temporary_user"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_user"`);
    await queryRunner.query(
      `ALTER TABLE "vehicle" RENAME TO "temporary_vehicle"`,
    );
    await queryRunner.query(
      `CREATE TABLE "vehicle" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('TRUCK','LOADER') ) NOT NULL, "carModel" text NOT NULL, "regNumber" varchar NOT NULL, "tanksVolume" text NOT NULL, "tanksCalibration" text NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "vehicleState" text NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "vehicle"("id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "tanksVolume", "tanksCalibration", "isEnabled", "vehicleState") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "tanksVolume", "tanksCalibration", "isEnabled", "vehicleState" FROM "temporary_vehicle"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_vehicle"`);
  }
}
