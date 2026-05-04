const router = require('express').Router();
const { list, getBySlug } = require('../controllers/product.controller');

router.get('/', list);
router.get('/:slug', getBySlug);

module.exports = router;
