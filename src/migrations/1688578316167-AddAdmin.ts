import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdmin1688578316167 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "user" ("role", "login", "password")
          VALUES ('ADMIN', 'admin', '$2b$05$ZId.arIHR5B65t5E4AqhgOHMt4WwK5JaTvasiVs.HREcpp2wGohRy');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
