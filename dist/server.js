var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import categoryRoutes from './routes/categoryRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
dotenv.config();
import compression from 'compression';
import helmet from 'helmet';
const app = express();
// Set up rate limiter: maximum of twenty requests per minute
import RateLimit from 'express-rate-limit';
const limiter = RateLimit({
    windowMs: 1 * 10 * 1000,
    max: 10,
});
// Apply rate limiter to all requests
app.use(limiter);
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
main().catch((err) => console.log(err));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        yield mongoose.connect(MONGO_URI);
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    });
}
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet.contentSecurityPolicy({
    directives: {
        'script-src': ["'self'", 'code.jquery.com', 'cdn.jsdelivr.net'],
    },
}));
app.use(compression()); // Compress all routes
app.use(express.static('public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');
// routes
app.get('/', (req, res) => {
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
