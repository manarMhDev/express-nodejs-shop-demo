const express = require("express");
const router = express.Router();
const UsersControllers = require('../controllers/users');

router.post('/login', UsersControllers.users_login)
router.post("/signup", UsersControllers.users_signup );


router.delete('/:userId', UsersControllers.users_delete_one);

module.exports = router;
