import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes';
import { checkDbConnection } from './lib/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Selamat datang di Simple Orders API!');
});
app.use('/api', apiRouter);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Terjadi kesalahan pada server!', error: err.message });
});

const startServer = async () => {
    await checkDbConnection();

    app.listen(PORT, () => {
        console.log(`Server berjalan di http://localhost:${PORT}`);
    });
};

startServer();