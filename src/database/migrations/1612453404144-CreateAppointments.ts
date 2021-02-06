import {MigrationInterface, QueryRunner, Table} from "typeorm";

export default class CreateAppointments1612453404144 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'appointments',
				columns: [
					{
						name: 'id',
						type: 'varchar',
						isPrimary: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()'
					},
					{
						name: 'provider',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'date',
						type: 'timestamp with time zone',
						isNullable: false,
					}
				]
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('appointments');
	}

}

/**
 * Linha do tempo
 * 
 * 1° semana: Agendamentos
 * 2° semana: Usuários
 * (NOVO DEV) 3° semana: Edição agendamentos
 * 4° semana: Compras
 * 
 * Evita que os bancos fiquem desatualizados quando tiver mais dev.
 * up - criar/fazer
 * down - deletar/desfazer 
 */