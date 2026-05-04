const router = require('express').Router();
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const { addItemSchema, updateItemSchema } = require('../validators/cart.schema');
const { getMine, addItem, updateItem, removeItem, clear } = require('../controllers/cart.controller');

router.use(requireAuth);
router.get('/', getMine);
router.post('/items', validate(addItemSchema), addItem);
router.patch('/items/:itemId', validate(updateItemSchema), updateItem);
router.delete('/items/:itemId', removeItem);
router.delete('/', clear);

module.exports = router;
