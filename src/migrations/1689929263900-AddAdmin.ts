import { MigrationInterface, QueryRunner } from 'typeorm';

/*eslint-disable*/
export class AddAdmin1689929263900 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "user" ("role", "login", "password")
          VALUES ('ADMIN', 'Администратор', '$2b$05$ZId.arIHR5B65t5E4AqhgOHMt4WwK5JaTvasiVs.HREcpp2wGohRy');`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {}
}
