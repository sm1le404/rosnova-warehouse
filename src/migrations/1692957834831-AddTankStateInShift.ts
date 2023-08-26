import { MigrationInterface, QueryRunner } from 'typeorm';

/*eslint-disable*/
export class AddTankStateInShift1692957834831 implements MigrationInterface {
    name = 'AddTankStateInShift1692957834831';

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "temporary_shift" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "updatedAt" integer NOT NULL DEFAULT (strftime('%s', 'now')), "deletedAt" datetime, "startedAt" integer NOT NULL, "closedAt" integer, "userId" integer NOT NULL, "startDispensersState" text, "finishDispensersState" text, "finishTankState" text, CONSTRAINT "FK_d6c3886ef9888f23e6d995d2640" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
        );
        await queryRunner.query(
            `INSERT INTO "temporary_shift"("id", "createdAt", "updatedAt", "deletedAt", "startedAt", "closedAt", "userId", "startDispensersState", "finishDispensersState", "finishTankState") SELECT "id", "createdAt", "updatedAt", "deletedAt", "startedAt", "closedAt", "userId", "startDispensersState", "finishDispensersState", "finishTankState" FROM "shift"`,
        );
        await queryRunner.query(`DROP TABLE "shift"`);
        await queryRunner.query(`ALTER TABLE "temporary_shift" RENAME TO "shift"`);
    }

    async down(queryRunner: QueryRunner): Promise<void> {}
}
