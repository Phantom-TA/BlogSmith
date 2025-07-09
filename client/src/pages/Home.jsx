import { useState } from "react"
import apiClient from "../../service/apiClient";
import { useEffect } from "react";
import { useCallback } from "react";
import { Link } from "react-router";

const Home = () =>{
    const [blogs,setBlogs] =useState([]);
    const [page,setPage] = useState(1);
    const [hasMore , setHasMore] =useState(true)
    const [trendingBlogs, setTrendingBlogs] = useState([]);

    const observer = useRef();
    const lastbBlogRef = useCallback(
        node => {
            if(observer.current)
                observer.current.disconnect();
            observer.current = new IntersectionObserver(entries =>{
                if(entries[0].isIntersecting && hasMore){
                    setPage(prevPage => prevPage +1)
                }
            }) 
            if(node)
                observer.current.observe(node);
        },
        [hasMore]
    );

    const fetchBlogs = async() =>{
        try {
            const res= await apiClient.getAllBlogs(page);
            setBlogs(prev => [...prev,...res.data.blogs])
            setHasMore(res.data.blogs.length > 0)
        } catch (error) {
            console.error("Failed to fetch blogs",error)
        }   
    }

    const fetchTrendingBlogs = async()=>{
        try {
            const res = await apiClient.getAllBlogs(1);
            setTrendingBlogs(res.data.blogs.slice(0, 5));
        }
        catch (err) {
            console.error(err);
        }
    }

    useEffect(()=>{
        fetchBlogs()
    },[page])
    
    useEffect(()=>{
        fetchTrendingBlogs();
    },[])

    return (
        <div className="home-container">
            <div className="blog-section">
                {blogs.map((blog,index)=>(
                    
                    <Link to={`blog/${blog.blog_id}`}  key={blog.blog_id} className="blog-card" ref={index === blogs.length-1 ? lastbBlogRef : null}>
                        <div className="blog-info">
                            <p className="blog-author">{blog.author?.personal_info?.username}</p>
                            <h2 className="blog-title">{blog.title}</h2>
                            <p className="blog-desc">{blog.desc}</p>
                        </div>
                        <img className="blog-banner" src={blog.banner} alt="banner" />
                    </Link>
                ))}
            </div>

            <div className="trending-section">
                <h2>Trending</h2>
                {trendingBlogs.map((blog,index)=>{
                    <div key={blog.blog_id} className="trending-blog">
                        <p className="trend-position">{index+1}.</p>
                        <div>
                            <p className="trend-title">{blog.title}</p>
                            <p className="trend-author">{blog.author?.personal_info?.username}</p>
                        </div>

                    </div>
                })}
            </div>


        </div>
    )
    
}
export default Home;