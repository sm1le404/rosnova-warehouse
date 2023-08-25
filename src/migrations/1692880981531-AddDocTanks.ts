import { MigrationInterface, QueryRunner } from 'typeorm';

/*eslint-disable*/
export class AddDocTanks1692880981531 implements MigrationInterface {
  name = 'AddDocTanks1692880981531';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_tank_history" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "temperature" float NOT NULL DEFAULT (0), "volume" float NOT NULL DEFAULT (0), "weight" float NOT NULL DEFAULT (0), "density" float NOT NULL DEFAULT (0), "fuelId" integer, "fuelHolderId" integer, "refineryId" integer, "tankId" integer, "docVolume" float NOT NULL DEFAULT (0), "docWeight" float NOT NULL DEFAULT (0), CONSTRAINT "FK_39a56465e3f2048e0fc62fca002" FOREIGN KEY ("tankId") REFERENCES "tank" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_a1f1da773d9b3f7c0d7e85c280b" FOREIGN KEY ("refineryId") REFERENCES "refinery" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4c4e6072bcd6b29afb58e19430a" FOREIGN KEY ("fuelHolderId") REFERENCES "fuel_holder" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_63c1eea6329fd9152795369b6b4" FOREIGN KEY ("fuelId") REFERENCES "fuel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_tank_history"("id", "createdAt", "updatedAt", "deletedAt", "temperature", "volume", "weight", "density", "fuelId", "fuelHolderId", "refineryId", "tankId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "temperature", "volume", "weight", "density", "fuelId", "fuelHolderId", "refineryId", "tankId" FROM "tank_history"`,
    );
    await queryRunner.query(`DROP TABLE "tank_history"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_tank_history" RENAME TO "tank_history"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_tank" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "sortIndex" integer NOT NULL, "totalVolume" float NOT NULL, "deathBalance" float NOT NULL DEFAULT (0), "temperature" float NOT NULL DEFAULT (0), "volume" float NOT NULL DEFAULT (0), "weight" float NOT NULL DEFAULT (0), "density" float NOT NULL DEFAULT (0), "level" integer NOT NULL DEFAULT (0), "isEnabled" boolean NOT NULL DEFAULT (1), "isBlocked" boolean NOT NULL DEFAULT (0), "addressId" integer, "fuelId" integer, "fuelHolderId" integer, "refineryId" integer, "error" varchar, "docVolume" float NOT NULL DEFAULT (0), "docWeight" float NOT NULL DEFAULT (0), CONSTRAINT "FK_7c395f57b1846cc188c6b559b27" FOREIGN KEY ("fuelId") REFERENCES "fuel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_6b1a641fdf709ce3154d47b787b" FOREIGN KEY ("fuelHolderId") REFERENCES "fuel_holder" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_d5c1e4908b46f8f996288846dae" FOREIGN KEY ("refineryId") REFERENCES "refinery" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_tank"("id", "createdAt", "updatedAt", "deletedAt", "sortIndex", "totalVolume", "deathBalance", "temperature", "volume", "weight", "density", "level", "isEnabled", "isBlocked", "addressId", "fuelId", "fuelHolderId", "refineryId", "error") SELECT "id", "createdAt", "updatedAt", "deletedAt", "sortIndex", "totalVolume", "deathBalance", "temperature", "volume", "weight", "density", "level", "isEnabled", "isBlocked", "addressId", "fuelId", "fuelHolderId", "refineryId", "error" FROM "tank"`,
    );
    await queryRunner.query(`DROP TABLE "tank"`);
    await queryRunner.query(`ALTER TABLE "temporary_tank" RENAME TO "tank"`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {}
}
