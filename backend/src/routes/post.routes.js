import { Router } from "express";
import upload from "../middlewares/multer.js";
import { createPost, deleteComment, editComment, getAllPosts, handleComment, handleLike } from "../controllers/post.controller.js";
import { isAuthenticated } from "../middlewares/isAuth.js";

const router = Router();


router.post('/create', isAuthenticated, upload.array('postImage', 4), createPost);
router.get('/getPosts',isAuthenticated, getAllPosts);
router.get('/like/:id', isAuthenticated, handleLike);
router.post('/comment/:id',isAuthenticated, handleComment);
router.put('/comment/:postId/:commentId', isAuthenticated, editComment);
router.delete('/comment/:postId/:commentId', isAuthenticated, deleteComment);




export default router;