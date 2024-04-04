import { MigrationInterface, QueryRunner } from 'typeorm';

/*eslint-disable*/
export class AddCardIdUser1711984863548 implements MigrationInterface {
  name = 'AddCardIdUser1711984863548';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "role" varchar CHECK( "role" IN ('OPERATOR','ADMIN') ) NOT NULL DEFAULT ('OPERATOR'), "login" varchar NOT NULL, "password" varchar NOT NULL, "refreshToken" varchar, "isEnabled" boolean NOT NULL DEFAULT (1), "cardId" varchar)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_user"("id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled", "cardId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled", "cardId" FROM "user"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "role" varchar CHECK( "role" IN ('OPERATOR','ADMIN') ) NOT NULL DEFAULT ('OPERATOR'), "login" varchar NOT NULL, "password" varchar NOT NULL, "refreshToken" varchar, "isEnabled" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `INSERT INTO "user"("id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled") SELECT "id", "createdAt", "updatedAt", "deletedAt", "role", "login", "password", "refreshToken", "isEnabled" FROM "temporary_user"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_user"`);
  }
}
