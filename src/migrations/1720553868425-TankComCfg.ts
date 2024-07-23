import { MigrationInterface, QueryRunner } from 'typeorm';

/*eslint-disable*/
export class TankComCfg1720553868425 implements MigrationInterface {
  name = 'TankComCfg1720553868425';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_tank" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "sortIndex" integer NOT NULL, "totalVolume" float NOT NULL, "deathBalance" float NOT NULL DEFAULT (0), "temperature" float NOT NULL DEFAULT (0), "volume" float NOT NULL DEFAULT (0), "weight" float NOT NULL DEFAULT (0), "docVolume" float NOT NULL DEFAULT (0), "docWeight" float NOT NULL DEFAULT (0), "density" float NOT NULL DEFAULT (0), "level" integer NOT NULL DEFAULT (0), "isEnabled" boolean NOT NULL DEFAULT (1), "isBlocked" boolean NOT NULL DEFAULT (0), "addressId" integer, "error" varchar, "comId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer, CONSTRAINT "FK_7c395f57b1846cc188c6b559b27" FOREIGN KEY ("fuelId") REFERENCES "fuel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_6b1a641fdf709ce3154d47b787b" FOREIGN KEY ("fuelHolderId") REFERENCES "fuel_holder" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_d5c1e4908b46f8f996288846dae" FOREIGN KEY ("refineryId") REFERENCES "refinery" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_tank"("id", "createdAt", "updatedAt", "deletedAt", "sortIndex", "totalVolume", "deathBalance", "temperature", "volume", "weight", "docVolume", "docWeight", "density", "level", "isEnabled", "isBlocked", "addressId", "error", "comId", "fuelId", "fuelHolderId", "refineryId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "sortIndex", "totalVolume", "deathBalance", "temperature", "volume", "weight", "docVolume", "docWeight", "density", "level", "isEnabled", "isBlocked", "addressId", "error", null, "fuelId", "fuelHolderId", "refineryId" FROM "tank"`,
    );
    await queryRunner.query(`DROP TABLE "tank"`);
    await queryRunner.query(`ALTER TABLE "temporary_tank" RENAME TO "tank"`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tank" RENAME TO "temporary_tank"`);
    await queryRunner.query(
      `CREATE TABLE "tank" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "sortIndex" integer NOT NULL, "totalVolume" float NOT NULL, "deathBalance" float NOT NULL DEFAULT (0), "temperature" float NOT NULL DEFAULT (0), "volume" float NOT NULL DEFAULT (0), "weight" float NOT NULL DEFAULT (0), "docVolume" float NOT NULL DEFAULT (0), "docWeight" float NOT NULL DEFAULT (0), "density" float NOT NULL DEFAULT (0), "level" integer NOT NULL DEFAULT (0), "isEnabled" boolean NOT NULL DEFAULT (1), "isBlocked" boolean NOT NULL DEFAULT (0), "addressId" integer, "error" varchar, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "tank"("id", "createdAt", "updatedAt", "deletedAt", "sortIndex", "totalVolume", "deathBalance", "temperature", "volume", "weight", "docVolume", "docWeight", "density", "level", "isEnabled", "isBlocked", "addressId", "error", "fuelId", "fuelHolderId", "refineryId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "sortIndex", "totalVolume", "deathBalance", "temperature", "volume", "weight", "docVolume", "docWeight", "density", "level", "isEnabled", "isBlocked", "addressId", "error", "fuelId", "fuelHolderId", "refineryId" FROM "temporary_tank"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_tank"`);
  }
}
