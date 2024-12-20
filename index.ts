import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookierParser from 'cookie-parser';
import { router } from './router/router';
import { errorMiddleware } from './middleware/errorMiddleware';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookierParser());
app.use('/api', router);
app.use(errorMiddleware);

const PORT = Number(process.env.PORT);

function startApp() {
	try {
		app.listen(PORT, () => console.log(`Server started on ${PORT}`));
	} catch (e) {
		console.log(e);
	}
}

startApp();
