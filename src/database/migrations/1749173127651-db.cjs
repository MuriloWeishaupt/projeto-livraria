const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Db1749173127651 {
    name = 'Db1749173127651'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`author\` CHANGE \`deleteAt\` \`deletedAt\` datetime NULL`);
        await queryRunner.query(`CREATE TABLE \`publisher\` (\`id\` int NOT NULL AUTO_INCREMENT, \`publisher_name\` varchar(100) NOT NULL, \`cnpj\` varchar(45) NOT NULL, \`email\` varchar(100) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`book\` ADD CONSTRAINT \`FK_49e85398dee3ea10b880e229a8d\` FOREIGN KEY (\`editorId\`) REFERENCES \`publisher\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`book\` DROP FOREIGN KEY \`FK_49e85398dee3ea10b880e229a8d\``);
        await queryRunner.query(`DROP TABLE \`publisher\``);
        await queryRunner.query(`ALTER TABLE \`author\` CHANGE \`deletedAt\` \`deleteAt\` datetime NULL`);
    }
}
