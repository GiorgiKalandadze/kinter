const Question = require('../models/Question');

exports.getCategories = async () => {
  const cats = await Question.aggregate([
    { $group: { _id: '$mainCategory', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  return cats.filter(c => c._id).map(c => ({ name: c._id, count: c.count }));
};

exports.getQuestions = async (category) => {
  const filter = category ? { mainCategory: category } : {};
  return Question.find(filter)
    .select('topic shortDescription longDescription tags')
    .sort({ topic: 1 })
    .lean();
};
