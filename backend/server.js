import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (_request, response) => {
	response.json({ ok: true });
});

app.listen(port, () => {
	console.log(`Backend running on http://localhost:${port}`);
});
