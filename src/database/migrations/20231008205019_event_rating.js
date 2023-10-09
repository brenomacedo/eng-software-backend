/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('event_ratings', function (table) {
    table.increments('id').primary();
    table.integer('rating').notNullable();
    table.integer('user_id').notNullable();
    table.integer('event_rated').notNullable();
    table.foreign('user_id').references('users.id');
    table.foreign('event_rated').references('events.id');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('event_ratings');
}
