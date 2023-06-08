import { MigrationInterface, QueryRunner } from "typeorm";

export class FixDateInToken1686239362547 implements MigrationInterface {
    name = 'FixDateInToken1686239362547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_token" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_token" ALTER COLUMN "updatedAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ALTER COLUMN "createdAt" DROP DEFAULT`);
    }

}
