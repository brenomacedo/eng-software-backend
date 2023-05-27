/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('events', table => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.string('description');
    table.string('location').notNullable();
    table.float('latitude').notNullable();
    table.float('longitude').notNullable();
    table.integer('user_id').references('id').inTable('users').notNullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('events');
}
