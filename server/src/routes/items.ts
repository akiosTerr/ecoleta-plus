import { Router } from 'express';
import knex from '../database/connection';

const router = Router();

// '1': 'https://svgshare.com/i/LuU.svg',
// 	'2': 'https://svgshare.com/i/LwE.svg',
// 	'3': 'https://svgshare.com/i/LvD.svg',
// 	'4': 'https://svgshare.com/i/LvZ.svg',
// 	'5': 'https://svgshare.com/i/LuV.svg',
// 	'6': 'https://svgshare.com/i/Lvk.svg',

const URIs = {
	19: 'https://svgshare.com/i/LuU.svg',
	20: 'https://svgshare.com/i/LwE.svg',
	21: 'https://svgshare.com/i/LvD.svg',
	22: 'https://svgshare.com/i/LvZ.svg',
	23: 'https://svgshare.com/i/LuV.svg',
	24: 'https://svgshare.com/i/Lvk.svg',
};

interface Item {
	id: string;
	title: string;
	image: string;
}

router.get('/', async (req, res) => {
	const items = await knex('items').select('*');

	const serializedItems = items.map((item: Item) => {
		return {
			id: item.id,
			title: item.title,
			image_url: `http://localhost:3333/uploads/images/${item.image}`,
			global_url: URIs[item.id],
		};
	});

	return res.json(serializedItems);
});

export default router;
