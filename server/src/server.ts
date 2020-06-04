import express from 'express';
import users from './routes/users';

const app = express();
const port = 3333;
app.use(express.json());
app.use('/users', users);

app.get('/', (req, res) => {
	res.json({ hello: 'world' });
});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
