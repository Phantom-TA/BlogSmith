import { useState } from "react";
import apiClient from "../../service/apiClient";
import { useEffect } from "react";
import { Link } from "react-router";
import "../styles/Profile.css"
import { useAuth } from "../context/authContext";
import LikeButton from "../components/LikeButton";
const Profile =()=>{
    const {user} = useAuth();
    const [blogs,setBlogs] =useState([]);
    
    const fetchProfile = async() =>{
        try {
            const userRes = await apiClient.getCurrentUser();
            const blogRes = await apiClient.getUserBlogs();
            setBlogs(blogRes.data.blogs)

        } catch (error) {
            console.error("Error in fetching user profile" ,error)
        }
    }
    const handleDelete = async(blogId) =>{
        try {
            await apiClient.deleteBlog(blogId);
            setBlogs((prev) => prev.filter((blog) => blog.blog_id !== blogId))
        } catch (error) {
            console.error("Failed to delete blog",error)

        }
    }

    useEffect(()=>{
        fetchProfile();
    },[])

    if (!user) {
        return <div>Loading profile...</div>;
    }
    return (
        <div className="profile-container">
            <div className="user-info">
                <img src={"/auth-pic.webp" || user.profile_img} alt="profile-img" className="profile-img"  />
                <h2>{user.fullname}</h2>
                <p>@{user.username}</p>
                
                {user.bio && <p className="bio">{user.bio}</p>}
            </div>

            <div className="user-blogs">
                <h2 className="user-blogs-header">Your Blogs</h2>
                {blogs.length === 0 ? <p>You haven't written any blog yet.</p>
                 : (
                    blogs.map((blog)=>(
                        <div className="user-blog-card" key={blog.blog_id}>
                            <div className="user-blog-details">
                                <h4>{blog.title}</h4>
                                <p>{blog.desc}</p>
                                 <span className="blog-detail-profile-like">
          <LikeButton blogId={blog._id} initialLikes={blog.total_likes} />
        </span>
                                <div className="user-blog-buttons">
                                    <Link to={`/blog/${blog.blog_id}/edit`} className="edit-btn">
                                    Edit
                                    </Link>
                                    <button onClick={() =>handleDelete(blog.blog_id)} className="delete-btn">
                                    Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                 )
                 }
            </div>
        </div>
    )
}
export default Profile;