import express from 'express';
import path from 'path';
import users from './routes/users';
import items from './routes/items';
import points from './routes/points';

const app = express();
const port = 3333;

app.use(express.json());
app.use('/users', users);
app.use('/items', items);
app.use('/points', points);
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.get('/', (req, res) => {
	res.json({ hello: 'world' });
});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
