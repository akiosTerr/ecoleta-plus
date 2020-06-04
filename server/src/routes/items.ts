import { Router } from 'express';
import knex from '../database/connection';

const router = Router();

router.get('/', async (req, res) => {
	const items = await knex('items').select('*');

	const serializedItems = items.map((item) => {
		return {
			id: item.id,
			title: item.title,
			image_url: `http://localhost:3333/uploads/images/${item.image}`,
		};
	});

	return res.json(serializedItems);
});

export default router;
