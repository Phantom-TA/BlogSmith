import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/api-response.js";
import jwt from 'jsonwebtoken'
import { Blog } from "../models/blog.model.js";

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;


const formatDataToSend = (user,res) =>{
    if(res){
    const access_token =  jwt.sign(
        {id:user._id},
         process.env.SECRET_ACCESS_KEY,
        { expiresIn: '15m' }
        );
        
        const refresh_token = jwt.sign(
        { id: user._id },
        process.env.SECRET_REFRESH_KEY,
        { expiresIn: '7d' }
        );

        res.cookie('access_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 
        });

        res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 
        });
    }

        return {
            
            profile_img: user?.profile_info?.profile_img || "",
            username: user?.personal_info?.username || "",
            fullname: user?.personal_info?.fullname || "",
            bio: user?.personal_info?.bio || "",
        }
}

const registerUser = async(req,res) => {
    console.log("started registration")
    const { fullname , email , password ,username } = req.body;

    if(!fullname || !email || !password || !username )
    {
        return res.status(400).json(
            new ApiResponse(400,{error:"Please fill all the required fields"})
        )
    }
    if(fullname.length<3)
        return res.status(400).json(
            new ApiResponse(400,{error:"Full name must be at least 3 letters long"})
        )
    if(!emailRegex.test(email)){
        return res.status(400).json(
            new ApiResponse(400,{error:"Email is invalid"})
        )
    }
    if(!passwordRegex.test(password)){
        return res.status(400).json(
            new ApiResponse(400,{error:"Password should be 6 to 20 characters long with 1 numeric, 1 lowercase and 1 uppercase letters"})
        )
    }

    try{
        const existingUser = await User.findOne({"personal_info.email" : email})
        if(existingUser)
            return res.status(400).json(
                new ApiResponse(400,{error:"User already exists"})
        )
        const existingUsername = await User.findOne({"personal_info.username" : username})
        if(existingUsername)
            return res.status(400).json(
                new ApiResponse(400,{error:"Username already exists"})
        )
        
        const user = await User.create({
            personal_info:{
            fullname , 
            email,
            password,
            username
            }
        })
       
        if(!user)
            return res.status(400).json(
                new ApiResponse(400,{error:"User not registered"})
        )
        await user.save();
        
        res.status(201).json(
            new ApiResponse(201,{message:"User registered successfully" , user_data: formatDataToSend(user,res) })
        )
    }
    catch(error){
        return res.status(500).json(
            new ApiResponse(500,{error:"Error in registering the user", detail: error.message})
        )
    }
}

const loginUser =async (req,res)=> { 
    const {email , password} = req.body;
    if(!email || !password)
        return res.status(400).json(
            new ApiResponse(400,{error:"Please fill all the required fields"})
     )
    try {
        
    
        const user = await User.findOne({"personal_info.email" : email})
        if(!user){
           return res.status(400).json(
           new ApiResponse(400,{error: "Email not found "})
        )
        }
        if(!user.google_auth){
           const isPasswordCorrect = await user.isPasswordCorrect(password);
           if(!isPasswordCorrect)
             return res.status(400).json(
             new ApiResponse(400,{error:"Incorrect password"})
             )
            else{
                return  res.status(201).json(
                    new ApiResponse(201,{message:"Login Successful" , user_data:formatDataToSend(user,res)})
                )
            }
        }
        else{
            return res.status(400).json(
                new ApiResponse(400,{error : "Account was created using Google . Try logging in with google." })
            )
        }
    }
    catch(error){
         return res.status(500).json(
            new ApiResponse(500,{message:"Error in logging the user", error})
         )
    }
}

const logoutUser = async (req, res) => {
    if (!req.user) {
        return res.status(400).json(
            new ApiResponse(400, { error: "Unauthorized" })
        );
    }
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    
    res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    
    res.status(201).json(
        new ApiResponse(201, { message: "Logged out successfully" })
    );
}

const refreshAccessToken = async (req, res) => {
    try {
        const refresh_token = req.cookies?.refresh_token;
        
        if (!refresh_token) {
            return res.status(401).json(
                new ApiResponse(401, { error: "Refresh token not found" })
            );
        }

        const decodedToken = jwt.verify(refresh_token, process.env.SECRET_REFRESH_KEY);
        const user = await User.findById(decodedToken.id);

         if (!user) {
            return res.status(401).json(
                new ApiResponse(401, { error: "Invalid refresh token" })
            );
        }

        const new_access_token = jwt.sign(
            { 
                id: user._id,
            },
            process.env.SECRET_ACCESS_KEY,
            { expiresIn: '15m' }
        );

        res.cookie('access_token', new_access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });

        res.status(201).json(
            new ApiResponse(201, { message: "Token refreshed successfully" })
        );
    }
    catch(error){
        return res.status(401).json(
            new ApiResponse(401, { error: "Token refresh failed"  })
        );
    }
}

const changePassword =async (req,res) =>{
    const {currentPassword , newPassword} =req.body;
    if ( !passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword) ) {
        return res.status(400).json({ error: "Password should be 6 to 20 characters long with 1 numeric, 1 lowercase and 1 uppercase letters" });
    }
    try{
        const user = await User.findById(req.user)
        if(!user){
            return res.status(400).json(
            new  ApiResponse(400,{error:"User not found"})
        )
        }
        if(user.google_auth){
            return res.status(400).json(
            new ApiResponse(400,{error:"You can't change account password because you signed in through google"})
        )
        }
        const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
        if(!isPasswordCorrect){
            return res.status(400).json(
            new ApiResponse(400,{error:"Invalid password"})
        )
        }
        user.password=newPassword;
        await user.save();
        res.status(201).json(
            new ApiResponse(200,{message: 'Password changed successfully'})
        );
    }
    catch(error){
        return res.status(500).json(
            new ApiResponse(500,{error:"Error in changing the password . Try again later"})
        )
    }

}

const createBlog = async( req,res) =>{
    const authorId = req.user;
    const { title , desc , banner , tags , content , draft , id :blog_id } = req.body;
    if(!title?.trim())
    {
        return res.status(400).json(
            new ApiResponse(400,{error:"You must provide a title to your blog "})
        )
    }
    if(!draft){
        if(!desc?.trim() || desc.length>150)
            return res.status(400).json(
                new ApiResponse(400,{error:"You must provide blog description under 150 characters"})
            )
    
        if(!banner?.trim())
        {
            return res.status(400).json(
                new ApiResponse(400,{error:"You must provide a banner to your blog"})
            )
        }
        if(!content?.length)
        {
            return res.status(400).json(
                new ApiResponse(400,{error:"You must provide some content to your blog"})
            )
        }
        if(!tags?.length || tags.length > 10) {
            return res.status(400).json(
                new ApiResponse( 400,{error: "Provide tags in order to publish the blog, Maximum 10"})
            )
        }
    }
    if (tags?.length)
        tags = tags.map(tag => tag.toLowerCase());

    try {
        const newBlog = await Blog.create({
            blog_id,
            title , 
            desc,
            banner,
            tags,
            content,
            author: authorId,
            draft
        })
        res.status(201).json(
            new ApiResponse(201, { message: draft ? "Draft saved" : "Blog published", blog: newBlog })
        );
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, { error: "Failed to create blog"})
        );
    }


}

const editBlog =async(req,res) =>{
    const { title , desc , banner , tags , content , draft } =req.body;
    const blog_id = req.params.blogId;
     if(!title?.trim())
    {
        return res.status(400).json(
            new ApiResponse(400,{error:"You must provide a title to your blog "})
        )
    }
    if(!draft){
        if(!desc?.trim() || desc.length>150)
            return res.status(400).json(
                new ApiResponse(400,{error:"You must provide blog description under 150 characters"})
            )
    
        if(!banner?.trim())
        {
            return res.status(400).json(
                new ApiResponse(400,{error:"You must provide a banner to your blog"})
            )
        }
        if(!content?.length)
        {
            return res.status(400).json(
                new ApiResponse(400,{error:"You must provide some content to your blog"})
            )
        }
        if(!tags?.length || tags.length > 10) {
            return res.status(400).json(
                new ApiResponse( 400,{error: "Provide tags in order to publish the blog, Maximum 10"})
            )
        }
    }
    if (tags?.length)
        tags = tags.map(tag => tag.toLowerCase());
    try {
        const blog = await Blog.findOne({blog_id})
        if(!blog)
            return res.status(400).json(
                new ApiResponse(400, { error: "Blog not found" })
            );
        if (blog.author.toString() !== req.user) {
            return res.status(400).json(
                new ApiResponse(400, { error: "Only the author can edit this blog" })
            );
        }

        blog.title = title;
        blog.desc = desc;
        blog.banner = banner;
        blog.tags = tags;
        blog.content = content;
        blog.draft = draft;

        await blog.save();
        return res.status(201).json(
            new ApiResponse(201, { message: "Blog updated successfully", blog })
        );
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, { error: "Error updating blog" })
        );
    }
}

const deleteBlog = async (req,res) =>{
    const blog_id = req.params.blogId;
    try {
        const blog = await Blog.findOne({ blog_id });
        if (!blog) {
            return res.status(400).json(
                new ApiResponse(400, { error: "Blog not found" })
            );
        }
        if (blog.author.toString() !== req.user) {
            return res.status(400).json(
                new ApiResponse(400, { error: "Only the author can delete this blog" })
            );
        }
        await Blog.deleteOne({ blog_id });
        return res.status(201).json(
            new ApiResponse(201, { message: "Blog deleted successfully" })
        );
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, { error: "Error deleting blog"})
        );
    }
}

const getBlogbyId = async(req,res) =>{
    const userId = req.user || null; 
    const blog_id = req.params.blogId;

    try {
        const blog = await Blog.findOne({ blog_id }).populate({
                path: 'author',
                select: 'personal_info.username personal_info.fullname personal_info.profile_img'
            });

        if (!blog) {
            return res.status(400).json(
                new ApiResponse(400, { error: "Blog not found" })
            );
        }
        if (blog.draft && (!userId || blog.author._id.toString() !== userId)) {
            return res.status(400).json(
                new ApiResponse(400, { error: "This blog is a draft so only its author can access it" })
            );
        }

        res.status(201).json(
            new ApiResponse(201, { blog })
        );

        
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, { error: "Failed to fetch blog" })
        );
    }
}

const getAllBlogs = async(req,res) =>{
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    try{
        const blogs = await Blog.find({draft:false}).sort({publishedAt: -1}).skip(skip).limit(limit).populate({
                    path: 'author',
                    select: 'personal_info.username personal_info.fullname personal_info.profile_img'
                    });
        const totalBlogs = await Blog.countDocuments({ draft: false });
        return res.status(201).json(
            new ApiResponse(201,{ total: totalBlogs, currentPage: page, totalPages: Math.ceil(totalBlogs / limit), blogs})
        )
    }
    catch(error){
        return res.status(500).json(
            new ApiResponse(500, { error: "Failed to fetch blogs"})
        );
    }
}

const getUserBlogs = async(req,res) =>{
    try{
        const blogs = await Blog.find({author: req.user}).sort({updatedAt:-1})
        return res.status(200).json(
            new ApiResponse(200, { blogs })
        );

    }
    catch(error){
         return res.status(500).json(
            new ApiResponse(500, { error: "Failed to fetch user's blogs" })
        );
    }
}

const likeBlog = async(req,res) =>{
    const blog_id = req.params.blogId;
    try{
        const blog = await Blog.findOne({blog_id});
         if (!blog) {
            return res.status(404).json(new ApiResponse(404, { error: "Blog not found" }));
        }
        const isAlreadyLiked = blog.liked_by.includes(req.user);
        if(isAlreadyLiked){
            blog.liked_by.pull(req.user);
            blog.total_likes-=1
        }
        else{
            blog.liked_by.push(req.user);
            blog.total_likes+=1;
        }
        await blog.save();
        return res.status(201).json(
            new ApiResponse(201,{ message: isAlreadyLiked ? "Blog unliked" : "Blog liked", total_likes: blog.total_likes})
        )
    }
    catch(error){
        return res.status(500).json(
            new ApiResponse(500, { error: "Failed like operation" })
        );
    }
}
const getCurrentUser = async(req,res) =>{
    try {
        const user = await User.findById(req.user);
        if (!user) {
            return res.status(400).json(
                new ApiResponse(400, { error: "User not found" })
            );
        }
        const userData = formatDataToSend(user);
        return res.status(201).json(
            new ApiResponse(201 ,{user: userData})
        )
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500,{error: "failed ot fetch user details"})
        )
        
    }
}
export {
    registerUser ,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword ,
    createBlog,
    editBlog ,
    deleteBlog,
    getBlogbyId,
    getAllBlogs,
    getUserBlogs,
    likeBlog,
    getCurrentUser
};

