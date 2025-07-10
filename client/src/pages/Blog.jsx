    import { useState } from "react";
    import { useParams } from "react-router";
    import apiClient from "../../service/apiClient";
    import { useEffect } from "react";
    import '../styles/Blog.css'
    const Blog = () =>{

            const {blogId} =useParams();
            const [blog , setBlog]=useState(null);

            const fetchBlog =async() =>{
                try {
                    const res = await apiClient.getBlogById(blogId)
                    setBlog(res.data.blog)
                } catch (error) {
                    console.error(error)
                }
            }

            useEffect(()=>{fetchBlog()},[blogId])
            
            if(!blog)
                return <h1>Loading..</h1>
            return (
                <div className="blog-detail-container">
                    <h1 className="blog-detail-title">{blog.title}</h1>
                    <div className="blog-detail-author"> By {blog.author?.personal_info?.fullname}</div>
                    <div className="blog-detail-desc">{blog.desc}</div>
                    <img src={blog.banner} alt="banner" className="blog-detail-banner" />
                    
                    <div className="blog-detail-content" dangerouslySetInnerHTML={{ __html: blog.content }} ></div>
                </div>
            )
    }
    export default Blog;