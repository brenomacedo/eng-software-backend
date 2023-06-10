/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('addresses', function (table) {
    table.increments('id').primary();
    table.string('state').notNullable();
    table.string('city').notNullable();
    table.string('neighborhood').notNullable();
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('users.id');
    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('addresses');
}
