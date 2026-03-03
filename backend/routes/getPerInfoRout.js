

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const {getInfo} = require('../controllers/getPerInfo');

router.route('/personnelInfo').get(auth,getInfo)


module.exports = router


