import Knex from 'knex';

export async function seed(knex: Knex) {
	await knex('items').insert([
		{ title: 'lamps', image: 'lamps.svg' },
		{ title: 'bateries', image: 'bateries.svg' },
		{ title: 'paper/cardboard', image: 'paper-cardboard.svg' },
		{ title: 'electronic waste', image: 'electronics.svg' },
		{ title: 'Organic', image: 'organic.svg' },
		{ title: 'kitchen oil', image: 'kitchen-oil.svg' },
	]);
}
