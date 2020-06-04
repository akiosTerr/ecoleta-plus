import express from 'express';

const app = express();
const port = 3333;
app.use(express.json());

app.get('/', (req, res) => {
	res.json({ hello: 'world' });
});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
