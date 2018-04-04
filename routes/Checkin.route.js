const express = require('express');
const router = express.Router();
const controller = require('../controllers/Checkin.controller');
const middleware = require('../middleware/User.middleware');
const commonMiddleware = require('../middleware/Common.middleware');


router.post("/checkin",middleware, controller.checkin );
router.get("/mycheckins",commonMiddleware,controller.getAllcheckings);
router.get("/generateqr",controller.generateQr);
router.get("/qr",controller.viewQr);
module.exports = router;