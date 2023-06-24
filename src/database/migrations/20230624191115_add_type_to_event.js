/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.alterTable('events', table => {
    table
      .integer('type')
      .references('id')
      .inTable('categories')
      .notNullable()
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.alterTable('events', table => {
    table.integer('type');
  });
}
