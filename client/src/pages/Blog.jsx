import { useState } from "react";
import { useParams } from "react-router";
import apiClient from "../../service/apiClient";
import { useEffect } from "react";

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

        return (
            <div className="blog-container">
                <h1 className="blog-title">{blog.title}</h1>
                <div className="blog-author"> By {blog.author?.personal_info?.fullname}</div>
                <img src={blog.banner} alt="banner" className="blog-banner" />
                <div className="blog-content">
                    {blog.content.map((para,index)=>{
                        <p key={index}>{para}</p>
                    })}
                </div>
            </div>
        )
}
export default Blog;