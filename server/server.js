require('dotenv').config();
const express = require('express');
const { join } = require('node:path');

const questionsRouter = require('./src/modules/questions/routes');

const app = express();
app.use(express.json());
app.use('/api/questions', questionsRouter);
app.use(express.static(join(__dirname, 'public')));
app.get('*', (req, res) => res.sendFile(join(__dirname, 'public', 'index.html')));

async function start() {
  if (process.env.DATA_SOURCE === 'mongo') {
    const mongoose = require('mongoose');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  }
  app.listen(process.env.PORT || 3000, () =>
    console.log(`Server running on port ${process.env.PORT || 3000} [${process.env.DATA_SOURCE || 'json'}]`)
  );
}

start().catch(err => { console.error(err); process.exit(1); });
