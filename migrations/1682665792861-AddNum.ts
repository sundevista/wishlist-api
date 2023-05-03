import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNum1682665792861 implements MigrationInterface {
    name = 'AddNum1682665792861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wish" ADD "num" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wish" DROP COLUMN "num"`);
    }

}
