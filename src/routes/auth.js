const router = require('express').Router();
const { 
    profile,
    register,
    logedIn,
    updateProfile,
    forgetPasswrd,
    updatePassword
} = require('../controller/auth');
const { isAuthenticate } = require('../middlewire/common');

router.get('/profile', profile);
router.post('/register', register);
router.post('/login', logedIn);
router.put('/update-profile', isAuthenticate, updateProfile);
router.post('/forget-password', forgetPasswrd);
router.put('/update-password',isAuthenticate, updatePassword);

module.exports = router;