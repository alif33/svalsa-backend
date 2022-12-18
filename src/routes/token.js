const router = require('express').Router();
const { generateToken } = require('../controller/tokenController');
const { isAuthenticate } = require('../middlewire/common');

router.post('/token', generateToken);

module.exports = router;