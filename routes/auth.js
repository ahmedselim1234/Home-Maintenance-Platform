
const authController=require('../controllers/auth');

const express=require('express')

const router=express.Router();

router.post('/signup',authController.signUp)
router.post('/login',authController.login)
router.post('/forgetPassword',authController.forgetPassword)
router.post('/verifyCode',authController.verifyCode)
router.put('/addNewPassword',authController.addNewPassword)
router.get('/refresh',authController.refresh)
router.post('/logout',authController.logout);


module.exports=router;