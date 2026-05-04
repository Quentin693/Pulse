const router = require('express').Router();
const { list, getByKey } = require('../controllers/content.controller');

router.get('/', list);
router.get('/:key', getByKey);

module.exports = router;
