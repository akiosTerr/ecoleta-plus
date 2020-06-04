import { Router } from 'express';
const router = Router();

const users = ['eys', 'fry', 'hoc'];

router.get('/', (req, res) => {
	console.log('user list');

	return res.json(users);
});
router.get('/:id', (req, res) => {
	const id = Number(req.params.id);

	return res.json(users[id]);
});

router.post('/', (req, res) => {
	const user = req.body.name;
	users.push(user);
	return res.json(user);
});

router.delete('/:id', (req, res) => {
	const id = Number(req.params.id);
	const fileterd_users = users.filter((user) => user !== users[id]);

	return res.json(fileterd_users);
});

export default router;
