import { Router } from "express";
import { activeCheck, commentPost, createPost, delete_comment_of_user, deletePost, get_Comment_By_Post, getAllPosts, increment_likes } from "../controllers/post.controller.js";
import multer from 'multer';

// middlewares/multer.js

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Make sure this folder exists
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

const router = Router();

router.route("/").get(activeCheck);

// posts routes
router.route("/post").post(upload.single('media'), createPost);
router.route("/posts").get(getAllPosts);
router.route("/delete_post").delete(deletePost);

// comments routes
router.route("/comment").post(commentPost);
router.route("/get_comments").get(get_Comment_By_Post);
router.route("/delete_comment").delete(delete_comment_of_user);
router.route("/increment_post_likes").post(increment_likes);


export default router;