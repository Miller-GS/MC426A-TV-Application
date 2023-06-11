import { MigrationInterface, QueryRunner } from "typeorm"

export class InsertSampleMedia1686512634503 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("\
            INSERT INTO media VALUES (1, 1, 'Movie', '2019-01-01 00:00:00');\
        ");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("\
            DELETE FROM media WHERE id = 1\
        ");
    }

}
