const router = require('express').Router();
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const { registerSchema, loginSchema } = require('../validators/auth.schema');
const { register, login, me } = require('../controllers/auth.controller');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', requireAuth, me);

module.exports = router;
