const router = require('express').Router();
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const { createBraceletSchema, updateBraceletSchema } = require('../validators/bracelet.schema');
const { list, create, update, remove } = require('../controllers/bracelet.controller');

router.use(requireAuth);
router.get('/', list);
router.post('/', validate(createBraceletSchema), create);
router.patch('/:id', validate(updateBraceletSchema), update);
router.delete('/:id', remove);

module.exports = router;
