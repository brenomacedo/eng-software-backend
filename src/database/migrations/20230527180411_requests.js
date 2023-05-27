/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('requests', function (table) {
    table.increments('id').primary();
    table.string('message').notNullable();
    table.enum('status', ['PENDING', 'ACCEPTED', 'DENIED']).notNullable();

    table
      .integer('user_id')
      .references('id')
      .inTable('users')
      .notNullable()
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table
      .integer('event_id')
      .references('id')
      .inTable('events')
      .notNullable()
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('events');
}
