import {Router} from "express";
import {changePassword, forgotPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, resendVerificationEmail, resetPassword, verifyUser} from '../controllers/auth.controller.js'
import {validate}  from '../middlewares/validator.middleware.js'
import {userRegistrationValidator,userLoginValidator} from '../validators/index.js'
import  protectRoute  from "../utils/protectRoute.js";

const router = Router();

router.route('/register').post(userRegistrationValidator(),validate,registerUser)
router.route('/verify/:unhashedToken').get(verifyUser)
router.route('/login').post(userLoginValidator(),validate,loginUser);
router.route('/logout').get(protectRoute,logoutUser);
router.route('/refreshAccessToken').get(refreshAccessToken);
router.route('/forgotpassword').get(forgotPassword);
router.route('/resetpassword/:unhashedToken').get(resetPassword);
router.route('/getMe').get(protectRoute,getCurrentUser);
router.route('/changePassword').get(protectRoute,changePassword);
router.route('/resendVerificationMail').get(protectRoute,resendVerificationEmail);
export default router