import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustWishEntity1683270940303 implements MigrationInterface {
    name = 'AdjustWishEntity1683270940303'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wish" DROP COLUMN "age"`);
        await queryRunner.query(`ALTER TABLE "wish" DROP COLUMN "num"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wish" ADD "num" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "wish" ADD "age" integer NOT NULL DEFAULT '198'`);
    }

}
