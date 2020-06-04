import { Router } from 'express';
import knex from '../database/connection';

const router = Router();

router.post('/', async (req, res) => {
	const {
		name,
		email,
		whatsapp,
		latitude,
		longitude,
		city,
		uf,
		items,
	} = req.body;

	const trx = await knex.transaction();

	const insertedIds = await trx('points').insert({
		image: 'image-fake',
		name,
		email,
		whatsapp,
		latitude,
		longitude,
		city,
		uf,
	});

	const point_id = insertedIds[0];

	const pointItems = items.map((item_id: number) => {
		return {
			item_id,
			point_id,
		};
	});

	await trx('point_items').insert(pointItems);

	return res.json({ insert: 'success' });
});

export default router;
