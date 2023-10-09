/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('user_ratings', function (table) {
    table.increments('id').primary();
    table.integer('rating').notNullable();
    table.integer('user_id').notNullable();
    table.integer('user_rated').notNullable();
    table.foreign('user_id').references('users.id');
    table.foreign('user_rated').references('users.id');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('user_ratings');
}
