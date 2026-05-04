const router = require('express').Router();
const { getPublicProfile, tapNFC } = require('../controllers/public.controller');

router.get('/profile/:handle', getPublicProfile);
router.post('/nfc/:tagId/tap', tapNFC);
router.get('/nfc/:tagId', tapNFC);

module.exports = router;
