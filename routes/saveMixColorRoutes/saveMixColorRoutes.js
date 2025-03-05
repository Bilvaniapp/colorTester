const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser'); // Import cookie-parser middleware

const { saveMixColor, getsaveColor,getDataMachine } = require('../../controller/saveMixColorControl/saveMixColorControl');

// Use cookie-parser middleware
router.use(cookieParser());

router.route('/user-color-save').post(saveMixColor);

router.route('/get-color-save').get(getsaveColor);

router.route('/api/developer/save/color').get(getDataMachine)

module.exports = router;
