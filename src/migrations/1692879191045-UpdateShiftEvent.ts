import { MigrationInterface, QueryRunner } from 'typeorm';

/*eslint-disable*/
export class UpdateShiftEvent1692879191045 implements MigrationInterface {
  name = 'UpdateShiftEvent1692879191045';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_shift" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "startedAt" integer NOT NULL, "closedAt" integer, "userId" integer, "startDispensersState" text, "finishDispensersState" text)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_shift"("id", "createdAt", "updatedAt", "deletedAt", "startedAt", "closedAt", "userId", "startDispensersState", "finishDispensersState") SELECT "id", "createdAt", "updatedAt", "deletedAt", "startedAt", "closedAt", "userId", "startDispensersState", "finishDispensersState" FROM "shift"`,
    );
    await queryRunner.query(`DROP TABLE "shift"`);
    await queryRunner.query(`ALTER TABLE "temporary_shift" RENAME TO "shift"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "role" varchar CHECK( "role" IN ('OPERATOR','ADMIN') ) NOT NULL DEFAULT ('OPERATOR'), "login" varchar NOT NULL, "password" varchar NOT NULL, "refreshToken" varchar, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_user"("id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled") SELECT "id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled" FROM "user"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_shift" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "startedAt" integer NOT NULL, "closedAt" integer, "startDispensersState" text, "finishDispensersState" text)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_shift"("id", "createdAt", "updatedAt", "deletedAt", "startedAt", "closedAt", "startDispensersState", "finishDispensersState") SELECT "id", "createdAt", "updatedAt", "deletedAt", "startedAt", "closedAt", "startDispensersState", "finishDispensersState" FROM "shift"`,
    );
    await queryRunner.query(`DROP TABLE "shift"`);
    await queryRunner.query(`ALTER TABLE "temporary_shift" RENAME TO "shift"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_event" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "name" varchar NOT NULL, "type" varchar CHECK( "type" IN ('default','create','update','delete') ) NOT NULL DEFAULT ('default'), "collection" varchar CHECK( "collection" IN ('default','operation','fuel','shift','settings','drain_fuel','dispenser_command') ) NOT NULL DEFAULT ('default'), "dataBefore" varchar NOT NULL, "dataAfter" varchar NOT NULL, "shiftId" integer, "userId" integer, CONSTRAINT "FK_b73505b6ca6ee9d0207ab350cfc" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
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
      `CREATE TABLE "temporary_event" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "name" varchar NOT NULL, "type" varchar CHECK( "type" IN ('default','create','update','delete') ) NOT NULL DEFAULT ('default'), "collection" varchar CHECK( "collection" IN ('default','operation','fuel','shift','settings','drain_fuel','dispenser_command') ) NOT NULL DEFAULT ('default'), "dataBefore" varchar NOT NULL, "dataAfter" varchar NOT NULL, "shiftId" integer, "userId" integer, CONSTRAINT "FK_b73505b6ca6ee9d0207ab350cfc" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_event"("id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId", "userId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId", "userId" FROM "event"`,
    );
    await queryRunner.query(`DROP TABLE "event"`);
    await queryRunner.query(`ALTER TABLE "temporary_event" RENAME TO "event"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_event" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "name" varchar NOT NULL, "type" varchar CHECK( "type" IN ('default','create','update','delete') ) NOT NULL DEFAULT ('default'), "collection" varchar CHECK( "collection" IN ('default','operation','fuel','shift','settings','drain_fuel','dispenser_command') ) NOT NULL DEFAULT ('default'), "dataBefore" varchar NOT NULL, "dataAfter" varchar NOT NULL, "shiftId" integer, "userId" integer, CONSTRAINT "FK_b73505b6ca6ee9d0207ab350cfc" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_01cd2b829e0263917bf570cb672" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_event"("id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId", "userId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId", "userId" FROM "event"`,
    );
    await queryRunner.query(`DROP TABLE "event"`);
    await queryRunner.query(`ALTER TABLE "temporary_event" RENAME TO "event"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event" RENAME TO "temporary_event"`);
    await queryRunner.query(
      `CREATE TABLE "event" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "name" varchar NOT NULL, "type" varchar CHECK( "type" IN ('default','create','update','delete') ) NOT NULL DEFAULT ('default'), "collection" varchar CHECK( "collection" IN ('default','operation','fuel','shift','settings','drain_fuel','dispenser_command') ) NOT NULL DEFAULT ('default'), "dataBefore" varchar NOT NULL, "dataAfter" varchar NOT NULL, "shiftId" integer, "userId" integer, CONSTRAINT "FK_b73505b6ca6ee9d0207ab350cfc" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "event"("id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId", "userId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId", "userId" FROM "temporary_event"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_event"`);
    await queryRunner.query(`ALTER TABLE "event" RENAME TO "temporary_event"`);
    await queryRunner.query(
      `CREATE TABLE "event" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "name" varchar NOT NULL, "type" varchar CHECK( "type" IN ('default','create','update','delete') ) NOT NULL DEFAULT ('default'), "collection" varchar CHECK( "collection" IN ('default','operation','fuel','shift','settings','drain_fuel','dispenser_command') ) NOT NULL DEFAULT ('default'), "dataBefore" varchar NOT NULL, "dataAfter" varchar NOT NULL, "shiftId" integer, "userId" integer, CONSTRAINT "FK_b73505b6ca6ee9d0207ab350cfc" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "event"("id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId", "userId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId", "userId" FROM "temporary_event"`,
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
    await queryRunner.query(`ALTER TABLE "event" RENAME TO "temporary_event"`);
    await queryRunner.query(
      `CREATE TABLE "event" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "name" varchar NOT NULL, "type" varchar CHECK( "type" IN ('default','create','update','delete') ) NOT NULL DEFAULT ('default'), "collection" varchar CHECK( "collection" IN ('default','operation','fuel','shift','settings','drain_fuel','dispenser_command') ) NOT NULL DEFAULT ('default'), "dataBefore" varchar NOT NULL, "dataAfter" varchar NOT NULL, "shiftId" integer, CONSTRAINT "FK_b73505b6ca6ee9d0207ab350cfc" FOREIGN KEY ("shiftId") REFERENCES "shift" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "event"("id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "name", "type", "collection", "dataBefore", "dataAfter", "shiftId" FROM "temporary_event"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_event"`);
    await queryRunner.query(`ALTER TABLE "shift" RENAME TO "temporary_shift"`);
    await queryRunner.query(
      `CREATE TABLE "shift" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "startedAt" integer NOT NULL, "closedAt" integer, "userId" integer, "startDispensersState" text, "finishDispensersState" text)`,
    );
    await queryRunner.query(
      `INSERT INTO "shift"("id", "createdAt", "updatedAt", "deletedAt", "startedAt", "closedAt", "startDispensersState", "finishDispensersState") SELECT "id", "createdAt", "updatedAt", "deletedAt", "startedAt", "closedAt", "startDispensersState", "finishDispensersState" FROM "temporary_shift"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_shift"`);
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "role" varchar CHECK( "role" IN ('OPERATOR','ADMIN') ) NOT NULL DEFAULT ('OPERATOR'), "login" varchar NOT NULL, "password" varchar NOT NULL, "refreshToken" varchar, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `INSERT INTO "user"("id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled") SELECT "id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled" FROM "temporary_user"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_user"`);
    await queryRunner.query(`ALTER TABLE "shift" RENAME TO "temporary_shift"`);
    await queryRunner.query(
      `CREATE TABLE "shift" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "startedAt" integer NOT NULL, "closedAt" integer, "userId" integer, "startDispensersState" text, "finishDispensersState" text, CONSTRAINT "FK_d6c3886ef9888f23e6d995d2640" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "shift"("id", "createdAt", "updatedAt", "deletedAt", "startedAt", "closedAt", "userId", "startDispensersState", "finishDispensersState") SELECT "id", "createdAt", "updatedAt", "deletedAt", "startedAt", "closedAt", "userId", "startDispensersState", "finishDispensersState" FROM "temporary_shift"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_shift"`);
  }
}
