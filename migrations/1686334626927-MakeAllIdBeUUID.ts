import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeAllIdBeUUID1686334626927 implements MigrationInterface {
    name = 'MakeAllIdBeUUID1686334626927'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_58f5c71eaab331645112cf8cfa5"`);
        await queryRunner.query(`ALTER TABLE "wish" DROP CONSTRAINT "FK_438d82247b32f3559b9f1157e49"`);
        await queryRunner.query(`ALTER TABLE "public_file" DROP CONSTRAINT "PK_bf2f5ba5aa6e3453b04cb4e4720"`);
        await queryRunner.query(`ALTER TABLE "public_file" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "public_file" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public_file" ADD CONSTRAINT "PK_bf2f5ba5aa6e3453b04cb4e4720" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "wish" DROP CONSTRAINT "FK_966cf22b509391a13a2a43a2e05"`);
        await queryRunner.query(`ALTER TABLE "wish" DROP CONSTRAINT "PK_e338d8f62014703650439326d3a"`);
        await queryRunner.query(`ALTER TABLE "wish" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "wish" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "wish" ADD CONSTRAINT "PK_e338d8f62014703650439326d3a" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "wish" DROP COLUMN "collectionId"`);
        await queryRunner.query(`ALTER TABLE "wish" ADD "collectionId" uuid`);
        await queryRunner.query(`ALTER TABLE "wish" DROP CONSTRAINT "REL_438d82247b32f3559b9f1157e4"`);
        await queryRunner.query(`ALTER TABLE "wish" DROP COLUMN "imageId"`);
        await queryRunner.query(`ALTER TABLE "wish" ADD "imageId" uuid`);
        await queryRunner.query(`ALTER TABLE "wish" ADD CONSTRAINT "UQ_438d82247b32f3559b9f1157e49" UNIQUE ("imageId")`);
        await queryRunner.query(`ALTER TABLE "collection" DROP CONSTRAINT "PK_ad3f485bbc99d875491f44d7c85"`);
        await queryRunner.query(`ALTER TABLE "collection" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "collection" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "collection" ADD CONSTRAINT "PK_ad3f485bbc99d875491f44d7c85" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "REL_58f5c71eaab331645112cf8cfa"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatarId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "avatarId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_58f5c71eaab331645112cf8cfa5" UNIQUE ("avatarId")`);
        await queryRunner.query(`ALTER TABLE "wish" ADD CONSTRAINT "FK_966cf22b509391a13a2a43a2e05" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wish" ADD CONSTRAINT "FK_438d82247b32f3559b9f1157e49" FOREIGN KEY ("imageId") REFERENCES "public_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_58f5c71eaab331645112cf8cfa5" FOREIGN KEY ("avatarId") REFERENCES "public_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_58f5c71eaab331645112cf8cfa5"`);
        await queryRunner.query(`ALTER TABLE "wish" DROP CONSTRAINT "FK_438d82247b32f3559b9f1157e49"`);
        await queryRunner.query(`ALTER TABLE "wish" DROP CONSTRAINT "FK_966cf22b509391a13a2a43a2e05"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_58f5c71eaab331645112cf8cfa5"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatarId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "avatarId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "REL_58f5c71eaab331645112cf8cfa" UNIQUE ("avatarId")`);
        await queryRunner.query(`ALTER TABLE "collection" DROP CONSTRAINT "PK_ad3f485bbc99d875491f44d7c85"`);
        await queryRunner.query(`ALTER TABLE "collection" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "collection" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "collection" ADD CONSTRAINT "PK_ad3f485bbc99d875491f44d7c85" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "wish" DROP CONSTRAINT "UQ_438d82247b32f3559b9f1157e49"`);
        await queryRunner.query(`ALTER TABLE "wish" DROP COLUMN "imageId"`);
        await queryRunner.query(`ALTER TABLE "wish" ADD "imageId" integer`);
        await queryRunner.query(`ALTER TABLE "wish" ADD CONSTRAINT "REL_438d82247b32f3559b9f1157e4" UNIQUE ("imageId")`);
        await queryRunner.query(`ALTER TABLE "wish" DROP COLUMN "collectionId"`);
        await queryRunner.query(`ALTER TABLE "wish" ADD "collectionId" integer`);
        await queryRunner.query(`ALTER TABLE "wish" DROP CONSTRAINT "PK_e338d8f62014703650439326d3a"`);
        await queryRunner.query(`ALTER TABLE "wish" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "wish" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "wish" ADD CONSTRAINT "PK_e338d8f62014703650439326d3a" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "wish" ADD CONSTRAINT "FK_966cf22b509391a13a2a43a2e05" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public_file" DROP CONSTRAINT "PK_bf2f5ba5aa6e3453b04cb4e4720"`);
        await queryRunner.query(`ALTER TABLE "public_file" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "public_file" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public_file" ADD CONSTRAINT "PK_bf2f5ba5aa6e3453b04cb4e4720" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "wish" ADD CONSTRAINT "FK_438d82247b32f3559b9f1157e49" FOREIGN KEY ("imageId") REFERENCES "public_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_58f5c71eaab331645112cf8cfa5" FOREIGN KEY ("avatarId") REFERENCES "public_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
