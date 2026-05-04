const router = require('express').Router();
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const { updateProfileSchema } = require('../validators/user.schema');
const { getProfile, updateProfile, getStats } = require('../controllers/user.controller');

router.use(requireAuth);
router.get('/me', getProfile);
router.patch('/me', validate(updateProfileSchema), updateProfile);
router.get('/me/stats', getStats);

module.exports = router;
