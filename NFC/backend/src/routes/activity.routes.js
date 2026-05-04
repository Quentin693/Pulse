const router = require('express').Router();
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const { createActivitySchema, updateActivitySchema } = require('../validators/activity.schema');
const { list, create, update, remove } = require('../controllers/activity.controller');

router.use(requireAuth);
router.get('/', list);
router.post('/', validate(createActivitySchema), create);
router.patch('/:id', validate(updateActivitySchema), update);
router.delete('/:id', remove);

module.exports = router;
