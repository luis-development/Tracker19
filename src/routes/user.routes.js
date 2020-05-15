const express = require('express');
const router = express.Router();

//requires
const { renderForm, renderSignin, addUser, enterUser, logout, renderConfirm, getdata } = require('../controllers/user.controller');

// get form
router.get('/sign-up', renderForm);

router.post('/sign-up/register', addUser);

// sign
router.get('/signin', renderSignin);

router.post('/signin/enter', enterUser);

// confirm your user
router.get('/confirm-account', renderConfirm);

router.put('/confirm/covid19Tracker', getdata);

// logout
router.get('/user/logout', logout);



module.exports = router;