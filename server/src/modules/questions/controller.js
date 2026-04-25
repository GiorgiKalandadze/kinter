const source = process.env.DATA_SOURCE === 'mongo'
  ? require('../../sources/mongo')
  : require('../../sources/json');

exports.getCategories = async (req, res) => {
  try {
    res.json(await source.getCategories());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    res.json(await source.getQuestions(req.query.category));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
