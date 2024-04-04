import { MigrationInterface, QueryRunner } from 'typeorm';

/*eslint-disable*/
export class AddDispenserQueue1711957109163 implements MigrationInterface {
  name = 'AddDispenserQueue1711957109163';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "dispenser_queue" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "dose" integer NOT NULL DEFAULT (0), "dispenserId" integer, "userId" integer, "fuelId" integer, "tankId" integer)`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "dispenser_queue"`);
  }
}
