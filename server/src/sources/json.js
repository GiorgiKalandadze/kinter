const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../../server/data');

let _cache = null;

function load() {
  if (_cache) return _cache;
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  _cache = files.flatMap(f => {
    try {
      return JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8'));
    } catch (e) {
      console.warn(`Skipping ${f}: ${e.message}`);
      return [];
    }
  });
  return _cache;
}

exports.getCategories = () => {
  const counts = {};
  load().forEach(q => {
    if (q.mainCategory) counts[q.mainCategory] = (counts[q.mainCategory] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, count]) => ({ name, count }));
};

exports.getQuestions = (category) => {
  const result = category ? load().filter(q => q.mainCategory === category) : load();
  return result.map(({ topic, shortDescription, longDescription, tags }) => ({
    topic,
    shortDescription: shortDescription || '',
    longDescription: longDescription || '',
    tags: (tags || []).filter(Boolean)
  }));
};
