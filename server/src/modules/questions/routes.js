const express = require('express');
const router = express.Router();
const { getQuestions, getCategories } = require('./controller');

router.get('/', getQuestions);
router.get('/categories', getCategories);

module.exports = router;
