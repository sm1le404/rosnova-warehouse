import { MigrationInterface, QueryRunner } from 'typeorm';

/*eslint-disable*/
export class AddShitfFields1692200776024 implements MigrationInterface {
    name = 'AddShitfFields1692200776024'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_shift" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "startedAt" integer NOT NULL, "closedAt" integer, "userId" integer, "startDispensersState" text, "finishDispensersState" text, CONSTRAINT "FK_d6c3886ef9888f23e6d995d2640" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_shift"("id", "createdAt", "updatedAt", "deletedAt", "startedAt", "closedAt", "userId") SELECT "id", "createdAt", "updatedAt", "deletedAt", "startedAt", "closedAt", "userId" FROM "shift"`);
        await queryRunner.query(`DROP TABLE "shift"`);
        await queryRunner.query(`ALTER TABLE "temporary_shift" RENAME TO "shift"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
