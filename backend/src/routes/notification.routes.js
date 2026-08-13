import express from 'express'
import { deleteAllNotifications, deleteNotification, getNotification } from '../controllers/notification.controller.js';
import {isAuthenticated} from '../middlewares/isAuth.js'
const router = express.Router();

router.get('/get', isAuthenticated, getNotification);
router.delete('/deleteOne/:id', isAuthenticated, deleteNotification);
router.delete('/delete', isAuthenticated, deleteAllNotifications);

export default router