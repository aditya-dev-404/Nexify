import express from 'express';
import { isAuthenticated } from '../middlewares/isAuth.js';
import { sendConnectionRequest } from '../controllers/connection.controller.js';
import { acceptConnectionRequest } from '../controllers/connection.controller.js';
import { rejectConnectionRequest } from '../controllers/connection.controller.js';
import { getConnectionStatus, removeConnection, getConnectionRequests } from '../controllers/connection.controller.js';
import { getUserConnections } from '../controllers/connection.controller.js';

const router = express.Router();

router.post('/send/:id', isAuthenticated, sendConnectionRequest);
router.put('/accept/:id', isAuthenticated, acceptConnectionRequest);
router.put('/reject/:id', isAuthenticated, rejectConnectionRequest);
router.get('/getStatus/:id', isAuthenticated, getConnectionStatus);
router.delete('/remove/:id', isAuthenticated, removeConnection)
router.get('/getRequests', isAuthenticated, getConnectionRequests)
router.get('/getConnections', isAuthenticated, getUserConnections);

export default router;