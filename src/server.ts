import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import categoryRoutes from './routes/categoryRoutes.js';
import itemRoutes from './routes/itemRoutes.js';

dotenv.config();

import compression from 'compression';
import helmet from 'helmet';

const app: Express = express();

// Set up rate limiter: maximum of twenty requests per minute
import RateLimit from 'express-rate-limit';
const limiter = RateLimit({
  windowMs: 1 * 10 * 1000, // 10 seconds
  max: 10,
});
// Apply rate limiter to all requests
app.use(limiter);

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

main().catch((err) => console.log(err));

async function main() {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await mongoose.connect(MONGO_URI!);
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      'script-src': ["'self'", 'code.jquery.com', 'cdn.jsdelivr.net'],
    },
  })
);

app.use(compression()); // Compress all routes

app.use(express.static('public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');

// routes
app.get('/', (req: Request, res: Response) => {
  res.redirect('/category/categories');
});

// category routes
app.use('/category', categoryRoutes);

// item routes
app.use('/item', itemRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
