/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.alterTable('events', table => {
    table.time('start_time').notNullable();
    table.time('end_time').notNullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.alterTable('users', table => {
    table.dropColumn('start_time');
    table.dropColumn('end_time');
  });
}
