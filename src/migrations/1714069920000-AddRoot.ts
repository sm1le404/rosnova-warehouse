import { MigrationInterface, QueryRunner } from 'typeorm';

/*eslint-disable*/
export class AddRoot1714069920000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "user" ("role", "login", "password")
          VALUES ('ROOT', 'Суперадмин', '$2b$05$XKO9zahAsSJUHkpwk1LMyOezp8M2W30/0ujO/lAaiCkehTYvYlmeO');`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {}
}
