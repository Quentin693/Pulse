const env = require('./config/env');
const { connectDB } = require('./config/db');
const app = require('./app');

(async () => {
  try {
    await connectDB(env.mongoUri);
    console.log(`[db] connected to ${env.mongoUri}`);
    app.listen(env.port, () => {
      console.log(`[api] PULSE backend ready on http://localhost:${env.port}`);
    });
  } catch (err) {
    console.error('[fatal]', err);
    process.exit(1);
  }
})();
