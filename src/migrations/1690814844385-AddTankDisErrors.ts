import { MigrationInterface, QueryRunner } from 'typeorm';

/* eslint-disable */
export class AddTankDisErrors1690814844385 implements MigrationInterface {
  name = 'AddTankDisErrors1690814844385';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_dispenser" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "sortIndex" integer NOT NULL, "currentCounter" float NOT NULL, "isEnabled" boolean NOT NULL DEFAULT (1), "isBlocked" boolean NOT NULL DEFAULT (0), "addressId" integer, "error" varchar)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_dispenser"("id", "createdAt", "updatedAt", "deletedAt", "sortIndex", "currentCounter", "isEnabled", "isBlocked", "addressId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "sortIndex", "currentCounter", "isEnabled", "isBlocked", "addressId" FROM "dispenser"`,
    );
    await queryRunner.query(`DROP TABLE "dispenser"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_dispenser" RENAME TO "dispenser"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_tank" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "sortIndex" integer NOT NULL, "totalVolume" float NOT NULL, "deathBalance" float NOT NULL DEFAULT (0), "temperature" float NOT NULL DEFAULT (0), "volume" float NOT NULL DEFAULT (0), "weight" float NOT NULL DEFAULT (0), "density" float NOT NULL DEFAULT (0), "level" integer NOT NULL DEFAULT (0), "isEnabled" boolean NOT NULL DEFAULT (1), "isBlocked" boolean NOT NULL DEFAULT (0), "addressId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer, "error" varchar, CONSTRAINT "FK_d5c1e4908b46f8f996288846dae" FOREIGN KEY ("refineryId") REFERENCES "refinery" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_6b1a641fdf709ce3154d47b787b" FOREIGN KEY ("fuelHolderId") REFERENCES "fuel_holder" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7c395f57b1846cc188c6b559b27" FOREIGN KEY ("fuelId") REFERENCES "fuel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_tank"("id", "createdAt", "updatedAt", "deletedAt", "sortIndex", "totalVolume", "deathBalance", "temperature", "volume", "weight", "density", "level", "isEnabled", "isBlocked", "addressId", "fuelId", "fuelHolderId", "refineryId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "sortIndex", "totalVolume", "deathBalance", "temperature", "volume", "weight", "density", "level", "isEnabled", "isBlocked", "addressId", "fuelId", "fuelHolderId", "refineryId" FROM "tank"`,
    );
    await queryRunner.query(`DROP TABLE "tank"`);
    await queryRunner.query(`ALTER TABLE "temporary_tank" RENAME TO "tank"`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryRunner: QueryRunner): Promise<void> {}
}
