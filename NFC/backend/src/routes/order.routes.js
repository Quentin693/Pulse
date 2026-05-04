const router = require('express').Router();
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const { checkoutSchema } = require('../validators/order.schema');
const { checkout, listMine, getOne } = require('../controllers/order.controller');

router.use(requireAuth);
router.post('/checkout', validate(checkoutSchema), checkout);
router.get('/', listMine);
router.get('/:id', getOne);

module.exports = router;
