
const authController=require('../controllers/auth');

const express=require('express')

const router=express.Router();

const rateLimit = require("express-rate-limit")

//rate limit
const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 60 minutes
	limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
	// store: ... , // Redis, Memcached, etc. See below.
})

router.use(limiter)

router.post('/signup',authController.signUp)
router.post('/login',authController.login)
router.post('/forgetPassword',authController.forgetPassword)
router.post('/verifyCode',authController.verifyCode)
router.put('/addNewPassword',authController.addNewPassword)
router.get('/refresh',authController.refresh)
router.post('/logout',authController.logout);


module.exports=router;