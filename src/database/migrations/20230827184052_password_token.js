export function up(knex) {
  return knex.schema.createTable('passwordtokens', function (table) {
    table.increments('id').primary().unsigned().notNullable();
    table.string('token', 200).notNullable();
    table.integer('user_id').unsigned().notNullable();

    //Definindo chave estrangeira para a coluna user_id referenciando a tabela de usuários
    table
      .foreign('user_id')
      .references('users.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    //Criando índice para a coluna token para otimizar buscas.
    table.index('token');

    table.tinyint('used').unsigned().notNullable().defaultTo(0);
    table.timestamps(true, true);
  });
}

export function down(knex) {
  return knex.schema.dropTable('passwordtokens');
}
