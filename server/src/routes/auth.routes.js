import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { changePassword, createBlog, deleteBlog, editBlog, getAllBlogs, getBlogbyId, getCurrentUser, getUserBlogs, likeBlog, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/auth.controller.js";


const router = Router();

router.post("/register",registerUser);
router.post("/login",loginUser)
router.post("/logout",verifyJWT,logoutUser)
router.post("/refresh",refreshAccessToken)
router.put("/change-password",verifyJWT,changePassword)
router.get("/me",verifyJWT,getCurrentUser)

router.post("/blog/create",verifyJWT,createBlog)
router.put("/blog/:blogId/edit",verifyJWT,editBlog)
router.delete("/blog/:blogId",verifyJWT,deleteBlog)
router.get("/blog/:blogId",getBlogbyId)
router.put("/blog/:blogId/like",verifyJWT,likeBlog)

router.get("/blogs",getAllBlogs)
router.get("/user/blogs",verifyJWT,getUserBlogs);

export default router;