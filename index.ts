import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import http from 'http';
import cookierParser from 'cookie-parser';
import { router } from './router/router';
import { errorMiddleware } from './middleware/errorMiddleware';
import { authSocketMiddleware } from './middleware/authSocketMiddleware';
import { initSocket } from './socket/socket';

const corsOptions = {
	origin: process.env.ORIGIN,
	credentials: true,
};

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = initSocket(server, corsOptions);

io.use(authSocketMiddleware);

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookierParser());
app.use('/api', router);
app.use(errorMiddleware);

const PORT = Number(process.env.PORT);

function startApp() {
	try {
		server.listen(PORT, () => console.log(`Server started on ${PORT}`));
	} catch (e) {
		console.log(e);
	}
}

startApp();
