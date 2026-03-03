const express = require('express');
const router = express.Router()
const {Login,Register,get_Type,
    Change_Password,getUsers,UpdateEtat} = require('../controllers/loginAuth');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'Images/'),
  filename: (req, file, cb) => {
    
    const ext = file.originalname.split('.').pop();
    // créer un nom personnalisé
    const filename = `user-${req.body.name || 'unknown'}-${Date.now()}.${ext}`;
    cb(null, filename);}
});
const upload = multer({ storage });

router.route('/Login').post(Login)
router.route('/Register').post(upload.single('image'),Register)
router.route('/userType/:id').get(get_Type)
router.route('/changePassword/:id').patch(upload.single('image'),Change_Password)
router.route('/getUsers').get(getUsers)
router.route('/updateUserEtat').patch(UpdateEtat)

module.exports = router


