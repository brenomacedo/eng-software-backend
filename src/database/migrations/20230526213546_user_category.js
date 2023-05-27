/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('users_categories', function (table) {
    table.increments('id').primary();
    table.integer('user_id').references('id').inTable('users').notNullable();
    table
      .integer('category_id')
      .references('id')
      .inTable('categories')
      .notNullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('users_categories');
}
