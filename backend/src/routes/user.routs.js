import express from 'express'
const router = express.Router();
import { isAuthenticated } from '../middlewares/isAuth.js';
import { getUser, updateProfileImage, updateUserProfile } from '../controllers/user.controller.js';
import upload from '../middlewares/multer.js';
import multer from 'multer';

router.get('/', isAuthenticated, getUser)

router.put('/updateUserProfile', isAuthenticated, upload.fields([
    {name:'profileImage', maxCount : 1},//we can access it using req.files.profileImage and req.files.coverImage
    {name:'coverImage', maxCount: 1}
]), updateUserProfile)



export default router;