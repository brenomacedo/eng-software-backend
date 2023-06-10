/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('categories').del();
  await knex('categories').insert([
    { name: 'Futebol' },
    { name: 'Vôlei' },
    { name: 'Basquete' },
    { name: 'Xadrez' },
    { name: 'Uno' },
    { name: 'Pôker' },
    { name: 'Cartas' },
    { name: 'RPG de Mesa' },
    { name: 'Ping Pong' },
    { name: 'Sinuca' },
    { name: 'Queimada' },
    { name: 'Handbol' },
    { name: 'Gaming House' },
    { name: 'Peteca' },
    { name: 'Corrida' },
    { name: 'Bicicleta' },
    { name: 'Ginástica' },
    { name: 'Bicicleta' },
    { name: 'Ginástica' },
    { name: 'Zumba' },
    { name: 'Tênis' },
    { name: 'Tênis de Praia' },
    { name: 'Outros' }
  ]);
}
