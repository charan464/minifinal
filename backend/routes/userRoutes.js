const express =require('express');
const { protect } = require("../middleware/authMiddleware");
const {registerUser}=require('../controllers/userController');
const {authUser}=require('../controllers/userController');
const {allUsers}=require('../controllers/userController');


const router = express.Router();

router.route('/').post(registerUser).get(protect,allUsers);;
router.post('/login',authUser)




module.exports=router;