/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('user_comments', function (table) {
    table.increments('id').primary();
    table.string('content').notNullable();
    table.integer('user_id').notNullable();
    table.integer('author_id').notNullable();
    table.boolean('edited').notNullable();
    table.foreign('user_id').references('users.id');
    table.foreign('author_id').references('users.id');
    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('user_comments');
}
