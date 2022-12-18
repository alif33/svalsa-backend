const router = require('express').Router();
const { signup, signin, permission } = require('../../controller/admin/auth');
const { isAdmin } = require('../../middlewire/common');
// const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../validators/auth');

router.put('/admin/permission', isAdmin, permission);
router.post('/admin/signup', signup);
router.post('/admin/signin', signin);


module.exports = router;