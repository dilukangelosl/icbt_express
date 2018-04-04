const express = require('express');
const router = express.Router();
const controller = require('../controllers/User.controller');
const middleware = require('../middleware/User.middleware');

router.post("/login",controller.login);

router.get('/login', middleware,controller.get);


router.post("/register", controller.register );
router.post("/test", middleware,controller.get);
router.get("/activate/:email/:token", controller.activateAccount);
router.get("/forgotpassword/:email", controller.sendpasswordResetEmail);
router.post("/resetpassword/:token", controller.resetPassword);
module.exports = router;