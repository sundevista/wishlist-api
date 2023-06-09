import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeDelete1686300370197 implements MigrationInterface {
    name = 'AddCascadeDelete1686300370197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wish" DROP CONSTRAINT "FK_966cf22b509391a13a2a43a2e05"`);
        await queryRunner.query(`ALTER TABLE "collection" DROP CONSTRAINT "FK_ca25eb01f75a85272300f336029"`);
        await queryRunner.query(`ALTER TABLE "wish" ADD CONSTRAINT "FK_966cf22b509391a13a2a43a2e05" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "collection" ADD CONSTRAINT "FK_ca25eb01f75a85272300f336029" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "collection" DROP CONSTRAINT "FK_ca25eb01f75a85272300f336029"`);
        await queryRunner.query(`ALTER TABLE "wish" DROP CONSTRAINT "FK_966cf22b509391a13a2a43a2e05"`);
        await queryRunner.query(`ALTER TABLE "collection" ADD CONSTRAINT "FK_ca25eb01f75a85272300f336029" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wish" ADD CONSTRAINT "FK_966cf22b509391a13a2a43a2e05" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
