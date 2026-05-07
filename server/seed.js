require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Question = require('./src/models/Question');

const DATA_DIR = path.join(__dirname, '../docs/data');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));

  const docs = files.flatMap(f => {
    try {
      return JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8'));
    } catch (e) {
      console.warn(`Skipping ${f}: ${e.message}`);
      return [];
    }
  });

  await Question.deleteMany({});
  console.log('Collection cleared');

  const result = await Question.insertMany(docs, { ordered: false });
  console.log(`Inserted ${result.length} questions from ${files.length} files`);

  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
