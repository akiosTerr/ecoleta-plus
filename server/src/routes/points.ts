import { Router } from 'express';
import knex from '../database/connection';

const router = Router();

router.get('/', async (req, res) => {
	const points = await knex('points').select('*');
	console.log(points);

	// const { city, uf, items } = req.query;

	// const parsedItems = String(items)
	// 	.split(',')
	// 	.map((item) => Number(item.trim()));

	// console.log(parsedItems);

	// const points = await knex('points')
	// 	.join('point_items', 'points.id', '=', 'point_items.point_id')
	// 	.whereIn('point_items.item_id', parsedItems)
	// 	.where('city', String(city))
	// 	.where('uf', String(uf))
	// 	.distinct()
	// 	.select('points.*');

	return res.json(points);
});

router.get('/:id', async (req, res) => {
	const { id } = req.params;

	const point = await knex('points').where('id', id).first();

	if (!point) {
		return res.status(400).json({ message: 'point not found' });
	}

	const items = await knex('items')
		.join('point_items', 'items.id', '=', 'point_items.item_id')
		.where('point_items.point_id', id)
		.select('items.title');

	return res.json({ point, items });
});

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

	knex.transaction(async (trx) => {
		try {
			const point = {
				image: 'image-fake',
				name,
				email,
				whatsapp,
				latitude,
				longitude,
				city,
				uf,
			};
			const ids = await trx('points').insert(point);

			const point_id = ids[0];

			const pointItems = items.map((item_id: number) => {
				return {
					item_id,
					point_id,
				};
			});

			await trx('point_items').insert(pointItems);
			await trx.commit();
			return res.json({ id: point_id, ...point });
		} catch (err) {
			return res.json({ failure: err });
		}
	});
});

export default router;
