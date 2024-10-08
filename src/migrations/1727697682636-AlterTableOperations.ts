import { MigrationInterface, QueryRunner } from 'typeorm';

/*eslint-disable*/
export class AlterTableOperations1727697682636 implements MigrationInterface {
  name = 'AlterTableOperations1727697682636';

  async up(queryRunner: QueryRunner): Promise<void> {
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
      `CREATE TABLE "temporary_vehicle" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('TRUCK','LOADER') ) NOT NULL, "carModel" text NOT NULL, "regNumber" varchar NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "driverId" integer, "trailerId" integer, "currentState" text, "sectionVolumes" text, CONSTRAINT "FK_822a3a73059d1892341f5c9f8af" FOREIGN KEY ("trailerId") REFERENCES "trailer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_cbb46518af7f7bf832253c62e08" FOREIGN KEY ("driverId") REFERENCES "driver" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_vehicle"("id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "isEnabled", "driverId", "trailerId", "currentState", "sectionVolumes") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "isEnabled", "driverId", "trailerId", "currentState", "sectionVolumes" FROM "vehicle"`,
    );
    await queryRunner.query(`DROP TABLE "vehicle"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_vehicle" RENAME TO "vehicle"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "role" varchar CHECK( "role" IN ('OPERATOR','ADMIN','ROOT') ) NOT NULL DEFAULT ('OPERATOR'), "login" varchar NOT NULL, "password" varchar NOT NULL, "refreshToken" varchar, "isEnabled" boolean NOT NULL DEFAULT (1), "cardId" varchar)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_user"("id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled", "cardId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled", "cardId" FROM "user"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_operation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('outcome','supply','internal','return') ) NOT NULL, "status" varchar CHECK( "status" IN ('created','started','progress','interrupted','stopped','finished') ) NOT NULL DEFAULT ('created'), "vehicleState" text, "destination" text, "numberTTN" text, "startedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "finishedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "docVolume" float NOT NULL, "factVolume" float, "factWeight" float, "docWeight" float NOT NULL, "docDensity" float NOT NULL, "docTemperature" float NOT NULL, "counterBefore" float DEFAULT (0), "counterAfter" float DEFAULT (0), "volumeBefore" float DEFAULT (0), "volumeAfter" float DEFAULT (0), "levelBefore" float DEFAULT (0), "levelAfter" float DEFAULT (0), "dispenserError" boolean DEFAULT (0), "dispenserId" integer, "driverId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer, "trailerId" integer, "vehicleId" integer, "tankId" integer, "shiftId" integer, "dateTTN" integer NOT NULL DEFAULT (strftime('%s', 'now')), "comment" text, "sourceTankId" integer, CONSTRAINT "FK_44a506978936572278194b22c22" FOREIGN KEY ("dispenserId") REFERENCES "dispenser" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4fe00161ef48138bfa3f434d1e2" FOREIGN KEY ("driverId") REFERENCES "driver" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_1ec7313173df4fe9b3d0cd9ff56" FOREIGN KEY ("fuelId") REFERENCES "fuel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_2a95009217197ba57060423fc00" FOREIGN KEY ("fuelHolderId") REFERENCES "fuel_holder" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4fa6456e8465dc3738f18ade562" FOREIGN KEY ("refineryId") REFERENCES "refinery" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_92a920d504d3057fbca9e0acb81" FOREIGN KEY ("trailerId") REFERENCES "trailer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_289c58cdde3f9e5e7d1c9111b6f" FOREIGN KEY ("vehicleId") REFERENCES "vehicle" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7c627c969c9eeccceb4b290806c" FOREIGN KEY ("tankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0fe8d164f8e00199fff3a1ab00e" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_operation"("id", "createdAt", "updatedAt", "deletedAt", "type", "status", "vehicleState", "destination", "numberTTN", "startedAt", "finishedAt", "docVolume", "factVolume", "factWeight", "docWeight", "docDensity", "docTemperature", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "dispenserError", "dispenserId", "driverId", "fuelId", "fuelHolderId", "refineryId", "trailerId", "vehicleId", "tankId", "shiftId", "dateTTN", "comment") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "status", "vehicleState", "destination", "numberTTN", "startedAt", "finishedAt", "docVolume", "factVolume", "factWeight", "docWeight", "docDensity", "docTemperature", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "dispenserError", "dispenserId", "driverId", "fuelId", "fuelHolderId", "refineryId", "trailerId", "vehicleId", "tankId", "shiftId", "dateTTN", "comment" FROM "operation"`,
    );
    await queryRunner.query(`DROP TABLE "operation"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_operation" RENAME TO "operation"`,
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
    await queryRunner.query(
      `CREATE TABLE "temporary_vehicle" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('TRUCK','LOADER') ) NOT NULL, "carModel" text NOT NULL, "regNumber" varchar NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "driverId" integer, "trailerId" integer, "currentState" text, "sectionVolumes" text, CONSTRAINT "FK_822a3a73059d1892341f5c9f8af" FOREIGN KEY ("trailerId") REFERENCES "trailer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_cbb46518af7f7bf832253c62e08" FOREIGN KEY ("driverId") REFERENCES "driver" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_vehicle"("id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "isEnabled", "driverId", "trailerId", "currentState", "sectionVolumes") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "isEnabled", "driverId", "trailerId", "currentState", "sectionVolumes" FROM "vehicle"`,
    );
    await queryRunner.query(`DROP TABLE "vehicle"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_vehicle" RENAME TO "vehicle"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "role" varchar CHECK( "role" IN ('OPERATOR','ADMIN','ROOT') ) NOT NULL DEFAULT ('OPERATOR'), "login" varchar NOT NULL, "password" varchar NOT NULL, "refreshToken" varchar, "isEnabled" boolean NOT NULL DEFAULT (1), "cardId" varchar)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_user"("id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled", "cardId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled", "cardId" FROM "user"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_event" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "name" varchar NOT NULL, "type" varchar CHECK( "type" IN ('default','create','update','delete') ) NOT NULL DEFAULT ('default'), "collection" varchar CHECK( "collection" IN ('default','operation','fuel','shift','settings','drain_fuel','dispenser_command') ) NOT NULL DEFAULT ('default'), "dataBefore" varchar NOT NULL, "dataAfter" varchar NOT NULL, "shiftId" integer, "userId" integer, CONSTRAINT "FK_01cd2b829e0263917bf570cb672" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_b73505b6ca6ee9d0207ab350cfc" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_event"("id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId", "userId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId", "userId" FROM "event"`,
    );
    await queryRunner.query(`DROP TABLE "event"`);
    await queryRunner.query(`ALTER TABLE "temporary_event" RENAME TO "event"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_operation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('outcome','supply','internal','mixed','return') ) NOT NULL, "status" varchar CHECK( "status" IN ('created','started','progress','interrupted','stopped','finished') ) NOT NULL DEFAULT ('created'), "vehicleState" text, "destination" text, "numberTTN" text, "startedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "finishedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "docVolume" float NOT NULL, "factVolume" float, "factWeight" float, "docWeight" float NOT NULL, "docDensity" float NOT NULL, "docTemperature" float NOT NULL, "counterBefore" float DEFAULT (0), "counterAfter" float DEFAULT (0), "volumeBefore" float DEFAULT (0), "volumeAfter" float DEFAULT (0), "levelBefore" float DEFAULT (0), "levelAfter" float DEFAULT (0), "dispenserError" boolean DEFAULT (0), "dispenserId" integer, "driverId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer, "trailerId" integer, "vehicleId" integer, "tankId" integer, "shiftId" integer, "dateTTN" integer NOT NULL DEFAULT (strftime('%s', 'now')), "comment" text, "sourceTankId" integer, CONSTRAINT "FK_44a506978936572278194b22c22" FOREIGN KEY ("dispenserId") REFERENCES "dispenser" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4fe00161ef48138bfa3f434d1e2" FOREIGN KEY ("driverId") REFERENCES "driver" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_1ec7313173df4fe9b3d0cd9ff56" FOREIGN KEY ("fuelId") REFERENCES "fuel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_2a95009217197ba57060423fc00" FOREIGN KEY ("fuelHolderId") REFERENCES "fuel_holder" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4fa6456e8465dc3738f18ade562" FOREIGN KEY ("refineryId") REFERENCES "refinery" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_92a920d504d3057fbca9e0acb81" FOREIGN KEY ("trailerId") REFERENCES "trailer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_289c58cdde3f9e5e7d1c9111b6f" FOREIGN KEY ("vehicleId") REFERENCES "vehicle" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7c627c969c9eeccceb4b290806c" FOREIGN KEY ("tankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0fe8d164f8e00199fff3a1ab00e" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_operation"("id", "createdAt", "updatedAt", "deletedAt", "type", "status", "vehicleState", "destination", "numberTTN", "startedAt", "finishedAt", "docVolume", "factVolume", "factWeight", "docWeight", "docDensity", "docTemperature", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "dispenserError", "dispenserId", "driverId", "fuelId", "fuelHolderId", "refineryId", "trailerId", "vehicleId", "tankId", "shiftId", "dateTTN", "comment", "sourceTankId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "status", "vehicleState", "destination", "numberTTN", "startedAt", "finishedAt", "docVolume", "factVolume", "factWeight", "docWeight", "docDensity", "docTemperature", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "dispenserError", "dispenserId", "driverId", "fuelId", "fuelHolderId", "refineryId", "trailerId", "vehicleId", "tankId", "shiftId", "dateTTN", "comment", "sourceTankId" FROM "operation"`,
    );
    await queryRunner.query(`DROP TABLE "operation"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_operation" RENAME TO "operation"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_operation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('outcome','supply','internal','mixed','return') ) NOT NULL, "status" varchar CHECK( "status" IN ('created','started','progress','interrupted','stopped','finished') ) NOT NULL DEFAULT ('created'), "vehicleState" text, "destination" text, "numberTTN" text, "startedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "finishedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "docVolume" float NOT NULL, "factVolume" float, "factWeight" float, "docWeight" float NOT NULL, "docDensity" float NOT NULL, "docTemperature" float NOT NULL, "counterBefore" float DEFAULT (0), "counterAfter" float DEFAULT (0), "volumeBefore" float DEFAULT (0), "volumeAfter" float DEFAULT (0), "levelBefore" float DEFAULT (0), "levelAfter" float DEFAULT (0), "dispenserError" boolean DEFAULT (0), "dispenserId" integer, "driverId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer, "trailerId" integer, "vehicleId" integer, "tankId" integer, "shiftId" integer, "dateTTN" integer NOT NULL DEFAULT (strftime('%s', 'now')), "comment" text, "sourceTankId" integer, CONSTRAINT "FK_44a506978936572278194b22c22" FOREIGN KEY ("dispenserId") REFERENCES "dispenser" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4fe00161ef48138bfa3f434d1e2" FOREIGN KEY ("driverId") REFERENCES "driver" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_1ec7313173df4fe9b3d0cd9ff56" FOREIGN KEY ("fuelId") REFERENCES "fuel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_2a95009217197ba57060423fc00" FOREIGN KEY ("fuelHolderId") REFERENCES "fuel_holder" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4fa6456e8465dc3738f18ade562" FOREIGN KEY ("refineryId") REFERENCES "refinery" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_92a920d504d3057fbca9e0acb81" FOREIGN KEY ("trailerId") REFERENCES "trailer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_289c58cdde3f9e5e7d1c9111b6f" FOREIGN KEY ("vehicleId") REFERENCES "vehicle" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7c627c969c9eeccceb4b290806c" FOREIGN KEY ("tankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0fe8d164f8e00199fff3a1ab00e" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_1a946e8faa240020b1519cbd7ef" FOREIGN KEY ("sourceTankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_operation"("id", "createdAt", "updatedAt", "deletedAt", "type", "status", "vehicleState", "destination", "numberTTN", "startedAt", "finishedAt", "docVolume", "factVolume", "factWeight", "docWeight", "docDensity", "docTemperature", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "dispenserError", "dispenserId", "driverId", "fuelId", "fuelHolderId", "refineryId", "trailerId", "vehicleId", "tankId", "shiftId", "dateTTN", "comment", "sourceTankId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "status", "vehicleState", "destination", "numberTTN", "startedAt", "finishedAt", "docVolume", "factVolume", "factWeight", "docWeight", "docDensity", "docTemperature", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "dispenserError", "dispenserId", "driverId", "fuelId", "fuelHolderId", "refineryId", "trailerId", "vehicleId", "tankId", "shiftId", "dateTTN", "comment", "sourceTankId" FROM "operation"`,
    );
    await queryRunner.query(`DROP TABLE "operation"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_operation" RENAME TO "operation"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_dispenser_queue" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "dose" integer NOT NULL DEFAULT (0), "dispenserId" integer, "userId" integer, "fuelId" integer, "tankId" integer, CONSTRAINT "FK_f9b630c07f3f461cd8d0a70a4e3" FOREIGN KEY ("dispenserId") REFERENCES "dispenser" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7f91ca3ee3344b8efb4e55db649" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0739a59038c2b7c482dd01b2fb1" FOREIGN KEY ("fuelId") REFERENCES "fuel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_3d582a7f9a58cba4c230258ba9a" FOREIGN KEY ("tankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_dispenser_queue"("id", "createdAt", "updatedAt", "deletedAt", "dose", "dispenserId", "userId", "fuelId", "tankId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "dose", "dispenserId", "userId", "fuelId", "tankId" FROM "dispenser_queue"`,
    );
    await queryRunner.query(`DROP TABLE "dispenser_queue"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_dispenser_queue" RENAME TO "dispenser_queue"`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "dispenser_queue" RENAME TO "temporary_dispenser_queue"`,
    );
    await queryRunner.query(
      `CREATE TABLE "dispenser_queue" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "dose" integer NOT NULL DEFAULT (0), "dispenserId" integer, "userId" integer, "fuelId" integer, "tankId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "dispenser_queue"("id", "createdAt", "updatedAt", "deletedAt", "dose", "dispenserId", "userId", "fuelId", "tankId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "dose", "dispenserId", "userId", "fuelId", "tankId" FROM "temporary_dispenser_queue"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_dispenser_queue"`);
    await queryRunner.query(
      `ALTER TABLE "operation" RENAME TO "temporary_operation"`,
    );
    await queryRunner.query(
      `CREATE TABLE "operation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('outcome','supply','internal','mixed','return') ) NOT NULL, "status" varchar CHECK( "status" IN ('created','started','progress','interrupted','stopped','finished') ) NOT NULL DEFAULT ('created'), "vehicleState" text, "destination" text, "numberTTN" text, "startedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "finishedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "docVolume" float NOT NULL, "factVolume" float, "factWeight" float, "docWeight" float NOT NULL, "docDensity" float NOT NULL, "docTemperature" float NOT NULL, "counterBefore" float DEFAULT (0), "counterAfter" float DEFAULT (0), "volumeBefore" float DEFAULT (0), "volumeAfter" float DEFAULT (0), "levelBefore" float DEFAULT (0), "levelAfter" float DEFAULT (0), "dispenserError" boolean DEFAULT (0), "dispenserId" integer, "driverId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer, "trailerId" integer, "vehicleId" integer, "tankId" integer, "shiftId" integer, "dateTTN" integer NOT NULL DEFAULT (strftime('%s', 'now')), "comment" text, "sourceTankId" integer, CONSTRAINT "FK_44a506978936572278194b22c22" FOREIGN KEY ("dispenserId") REFERENCES "dispenser" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4fe00161ef48138bfa3f434d1e2" FOREIGN KEY ("driverId") REFERENCES "driver" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_1ec7313173df4fe9b3d0cd9ff56" FOREIGN KEY ("fuelId") REFERENCES "fuel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_2a95009217197ba57060423fc00" FOREIGN KEY ("fuelHolderId") REFERENCES "fuel_holder" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4fa6456e8465dc3738f18ade562" FOREIGN KEY ("refineryId") REFERENCES "refinery" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_92a920d504d3057fbca9e0acb81" FOREIGN KEY ("trailerId") REFERENCES "trailer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_289c58cdde3f9e5e7d1c9111b6f" FOREIGN KEY ("vehicleId") REFERENCES "vehicle" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7c627c969c9eeccceb4b290806c" FOREIGN KEY ("tankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0fe8d164f8e00199fff3a1ab00e" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "operation"("id", "createdAt", "updatedAt", "deletedAt", "type", "status", "vehicleState", "destination", "numberTTN", "startedAt", "finishedAt", "docVolume", "factVolume", "factWeight", "docWeight", "docDensity", "docTemperature", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "dispenserError", "dispenserId", "driverId", "fuelId", "fuelHolderId", "refineryId", "trailerId", "vehicleId", "tankId", "shiftId", "dateTTN", "comment", "sourceTankId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "status", "vehicleState", "destination", "numberTTN", "startedAt", "finishedAt", "docVolume", "factVolume", "factWeight", "docWeight", "docDensity", "docTemperature", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "dispenserError", "dispenserId", "driverId", "fuelId", "fuelHolderId", "refineryId", "trailerId", "vehicleId", "tankId", "shiftId", "dateTTN", "comment", "sourceTankId" FROM "temporary_operation"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_operation"`);
    await queryRunner.query(
      `ALTER TABLE "operation" RENAME TO "temporary_operation"`,
    );
    await queryRunner.query(
      `CREATE TABLE "operation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('outcome','supply','internal','return') ) NOT NULL, "status" varchar CHECK( "status" IN ('created','started','progress','interrupted','stopped','finished') ) NOT NULL DEFAULT ('created'), "vehicleState" text, "destination" text, "numberTTN" text, "startedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "finishedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "docVolume" float NOT NULL, "factVolume" float, "factWeight" float, "docWeight" float NOT NULL, "docDensity" float NOT NULL, "docTemperature" float NOT NULL, "counterBefore" float DEFAULT (0), "counterAfter" float DEFAULT (0), "volumeBefore" float DEFAULT (0), "volumeAfter" float DEFAULT (0), "levelBefore" float DEFAULT (0), "levelAfter" float DEFAULT (0), "dispenserError" boolean DEFAULT (0), "dispenserId" integer, "driverId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer, "trailerId" integer, "vehicleId" integer, "tankId" integer, "shiftId" integer, "dateTTN" integer NOT NULL DEFAULT (strftime('%s', 'now')), "comment" text, "sourceTankId" integer, CONSTRAINT "FK_44a506978936572278194b22c22" FOREIGN KEY ("dispenserId") REFERENCES "dispenser" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4fe00161ef48138bfa3f434d1e2" FOREIGN KEY ("driverId") REFERENCES "driver" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_1ec7313173df4fe9b3d0cd9ff56" FOREIGN KEY ("fuelId") REFERENCES "fuel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_2a95009217197ba57060423fc00" FOREIGN KEY ("fuelHolderId") REFERENCES "fuel_holder" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4fa6456e8465dc3738f18ade562" FOREIGN KEY ("refineryId") REFERENCES "refinery" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_92a920d504d3057fbca9e0acb81" FOREIGN KEY ("trailerId") REFERENCES "trailer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_289c58cdde3f9e5e7d1c9111b6f" FOREIGN KEY ("vehicleId") REFERENCES "vehicle" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7c627c969c9eeccceb4b290806c" FOREIGN KEY ("tankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0fe8d164f8e00199fff3a1ab00e" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "operation"("id", "createdAt", "updatedAt", "deletedAt", "type", "status", "vehicleState", "destination", "numberTTN", "startedAt", "finishedAt", "docVolume", "factVolume", "factWeight", "docWeight", "docDensity", "docTemperature", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "dispenserError", "dispenserId", "driverId", "fuelId", "fuelHolderId", "refineryId", "trailerId", "vehicleId", "tankId", "shiftId", "dateTTN", "comment", "sourceTankId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "status", "vehicleState", "destination", "numberTTN", "startedAt", "finishedAt", "docVolume", "factVolume", "factWeight", "docWeight", "docDensity", "docTemperature", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "dispenserError", "dispenserId", "driverId", "fuelId", "fuelHolderId", "refineryId", "trailerId", "vehicleId", "tankId", "shiftId", "dateTTN", "comment", "sourceTankId" FROM "temporary_operation"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_operation"`);
    await queryRunner.query(`ALTER TABLE "event" RENAME TO "temporary_event"`);
    await queryRunner.query(
      `CREATE TABLE "event" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "name" varchar NOT NULL, "type" varchar CHECK( "type" IN ('default','create','update','delete') ) NOT NULL DEFAULT ('default'), "collection" varchar CHECK( "collection" IN ('default','operation','fuel','shift','settings','drain_fuel','dispenser_command') ) NOT NULL DEFAULT ('default'), "dataBefore" varchar NOT NULL, "dataAfter" varchar NOT NULL, "shiftId" integer, "userId" integer, CONSTRAINT "FK_01cd2b829e0263917bf570cb672" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_b73505b6ca6ee9d0207ab350cfc" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "event"("id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId", "userId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId", "userId" FROM "temporary_event"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_event"`);
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "role" varchar CHECK( "role" IN ('OPERATOR','ADMIN','ROOT') ) NOT NULL DEFAULT ('OPERATOR'), "login" varchar NOT NULL, "password" varchar NOT NULL, "refreshToken" varchar, "isEnabled" boolean NOT NULL DEFAULT (1), "cardId" varchar)`,
    );
    await queryRunner.query(
      `INSERT INTO "user"("id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled", "cardId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled", "cardId" FROM "temporary_user"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_user"`);
    await queryRunner.query(
      `ALTER TABLE "vehicle" RENAME TO "temporary_vehicle"`,
    );
    await queryRunner.query(
      `CREATE TABLE "vehicle" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('TRUCK','LOADER') ) NOT NULL, "carModel" text NOT NULL, "regNumber" varchar NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "driverId" integer, "trailerId" integer, "currentState" text, "sectionVolumes" text, CONSTRAINT "FK_822a3a73059d1892341f5c9f8af" FOREIGN KEY ("trailerId") REFERENCES "trailer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_cbb46518af7f7bf832253c62e08" FOREIGN KEY ("driverId") REFERENCES "driver" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "vehicle"("id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "isEnabled", "driverId", "trailerId", "currentState", "sectionVolumes") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "isEnabled", "driverId", "trailerId", "currentState", "sectionVolumes" FROM "temporary_vehicle"`,
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
    await queryRunner.query(
      `ALTER TABLE "operation" RENAME TO "temporary_operation"`,
    );
    await queryRunner.query(
      `CREATE TABLE "operation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('outcome','supply','internal','return') ) NOT NULL, "status" varchar CHECK( "status" IN ('created','started','progress','interrupted','stopped','finished') ) NOT NULL DEFAULT ('created'), "vehicleState" text, "destination" text, "numberTTN" text, "startedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "finishedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "docVolume" float NOT NULL, "factVolume" float, "factWeight" float, "docWeight" float NOT NULL, "docDensity" float NOT NULL, "docTemperature" float NOT NULL, "counterBefore" float DEFAULT (0), "counterAfter" float DEFAULT (0), "volumeBefore" float DEFAULT (0), "volumeAfter" float DEFAULT (0), "levelBefore" float DEFAULT (0), "levelAfter" float DEFAULT (0), "dispenserError" boolean DEFAULT (0), "dispenserId" integer, "driverId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer, "trailerId" integer, "vehicleId" integer, "tankId" integer, "shiftId" integer, "dateTTN" integer NOT NULL DEFAULT (strftime('%s', 'now')), "comment" text, CONSTRAINT "FK_44a506978936572278194b22c22" FOREIGN KEY ("dispenserId") REFERENCES "dispenser" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4fe00161ef48138bfa3f434d1e2" FOREIGN KEY ("driverId") REFERENCES "driver" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_1ec7313173df4fe9b3d0cd9ff56" FOREIGN KEY ("fuelId") REFERENCES "fuel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_2a95009217197ba57060423fc00" FOREIGN KEY ("fuelHolderId") REFERENCES "fuel_holder" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4fa6456e8465dc3738f18ade562" FOREIGN KEY ("refineryId") REFERENCES "refinery" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_92a920d504d3057fbca9e0acb81" FOREIGN KEY ("trailerId") REFERENCES "trailer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_289c58cdde3f9e5e7d1c9111b6f" FOREIGN KEY ("vehicleId") REFERENCES "vehicle" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7c627c969c9eeccceb4b290806c" FOREIGN KEY ("tankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0fe8d164f8e00199fff3a1ab00e" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "operation"("id", "createdAt", "updatedAt", "deletedAt", "type", "status", "vehicleState", "destination", "numberTTN", "startedAt", "finishedAt", "docVolume", "factVolume", "factWeight", "docWeight", "docDensity", "docTemperature", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "dispenserError", "dispenserId", "driverId", "fuelId", "fuelHolderId", "refineryId", "trailerId", "vehicleId", "tankId", "shiftId", "dateTTN", "comment") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "status", "vehicleState", "destination", "numberTTN", "startedAt", "finishedAt", "docVolume", "factVolume", "factWeight", "docWeight", "docDensity", "docTemperature", "counterBefore", "counterAfter", "volumeBefore", "volumeAfter", "levelBefore", "levelAfter", "dispenserError", "dispenserId", "driverId", "fuelId", "fuelHolderId", "refineryId", "trailerId", "vehicleId", "tankId", "shiftId", "dateTTN", "comment" FROM "temporary_operation"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_operation"`);
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "role" varchar CHECK( "role" IN ('OPERATOR','ADMIN','ROOT') ) NOT NULL DEFAULT ('OPERATOR'), "login" varchar NOT NULL, "password" varchar NOT NULL, "refreshToken" varchar, "isEnabled" boolean NOT NULL DEFAULT (1), "cardId" varchar)`,
    );
    await queryRunner.query(
      `INSERT INTO "user"("id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled", "cardId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled", "cardId" FROM "temporary_user"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_user"`);
    await queryRunner.query(
      `ALTER TABLE "vehicle" RENAME TO "temporary_vehicle"`,
    );
    await queryRunner.query(
      `CREATE TABLE "vehicle" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "type" varchar CHECK( "type" IN ('TRUCK','LOADER') ) NOT NULL, "carModel" text NOT NULL, "regNumber" varchar NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "driverId" integer, "trailerId" integer, "currentState" text, "sectionVolumes" text, CONSTRAINT "FK_822a3a73059d1892341f5c9f8af" FOREIGN KEY ("trailerId") REFERENCES "trailer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_cbb46518af7f7bf832253c62e08" FOREIGN KEY ("driverId") REFERENCES "driver" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "vehicle"("id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "isEnabled", "driverId", "trailerId", "currentState", "sectionVolumes") SELECT "id", "createdAt", "updatedAt", "deletedAt", "type", "carModel", "regNumber", "isEnabled", "driverId", "trailerId", "currentState", "sectionVolumes" FROM "temporary_vehicle"`,
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
