require('express-async-errors');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const env = require('./config/env');
const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const braceletRoutes = require('./routes/bracelet.routes');
const activityRoutes = require('./routes/activity.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const contentRoutes = require('./routes/content.routes');
const publicRoutes = require('./routes/public.routes');

const app = express();

app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.nodeEnv === 'test' ? 'tiny' : 'dev'));
app.use(requestLogger);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'pulse-api', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bracelets', braceletRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/public', publicRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
