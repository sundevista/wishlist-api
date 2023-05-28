import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1685281668364 implements MigrationInterface {
  name = 'Initial1685281668364';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "public_file" ("id" SERIAL NOT NULL, "url" character varying NOT NULL, "key" character varying NOT NULL, CONSTRAINT "PK_bf2f5ba5aa6e3453b04cb4e4720" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(25) NOT NULL, "email" character varying(70) NOT NULL, "password" character varying(60) NOT NULL, "full_name" character varying(40) NOT NULL, "level" integer NOT NULL DEFAULT '1', "xp" integer NOT NULL DEFAULT '0', "avatarId" integer, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_58f5c71eaab331645112cf8cfa" UNIQUE ("avatarId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "wish" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "price" integer NOT NULL, "rating" integer NOT NULL, "link" character varying NOT NULL, "collectionId" integer, "imageId" integer, CONSTRAINT "REL_438d82247b32f3559b9f1157e4" UNIQUE ("imageId"), CONSTRAINT "PK_e338d8f62014703650439326d3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "collection" ("id" SERIAL NOT NULL, "public" boolean NOT NULL, "name" character varying NOT NULL, "description" character varying, "userId" uuid, CONSTRAINT "PK_ad3f485bbc99d875491f44d7c85" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_58f5c71eaab331645112cf8cfa5" FOREIGN KEY ("avatarId") REFERENCES "public_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wish" ADD CONSTRAINT "FK_966cf22b509391a13a2a43a2e05" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wish" ADD CONSTRAINT "FK_438d82247b32f3559b9f1157e49" FOREIGN KEY ("imageId") REFERENCES "public_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "collection" ADD CONSTRAINT "FK_ca25eb01f75a85272300f336029" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "collection" DROP CONSTRAINT "FK_ca25eb01f75a85272300f336029"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wish" DROP CONSTRAINT "FK_438d82247b32f3559b9f1157e49"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wish" DROP CONSTRAINT "FK_966cf22b509391a13a2a43a2e05"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_58f5c71eaab331645112cf8cfa5"`,
    );
    await queryRunner.query(`DROP TABLE "collection"`);
    await queryRunner.query(`DROP TABLE "wish"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "public_file"`);
  }
}
