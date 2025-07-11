
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import apiClient from "../../service/apiClient";
import "../styles/Home.css";

import { useAuth } from "../context/authContext";
import LikeButton from "../components/LikeButton";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const observer = useRef();
  const { user } = useAuth();
  const navigate = useNavigate();

  const lastBlogRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setTimeout(() => {
              setPage((prevPage) => prevPage + 1);
            }, 200);
          }
        },
        { threshold: 1.0 }
      );
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  const fetchBlogs = async () => {
    try {
      const res = await apiClient.getAllBlogs(page);
      const newBlogs = res.data.blogs;
      setBlogs((prev) => {
        const existingIds = new Set(prev.map((b) => b.blog_id));
        const filtered = newBlogs.filter((b) => !existingIds.has(b.blog_id));
        return [...prev, ...filtered];
      });
      setHasMore(newBlogs.length > 0);
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    }
  };

  const fetchTrendingBlogs = async () => {
    try {
      const res = await apiClient.getAllBlogs(1);
      setTrendingBlogs(res.data.blogs.slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch trending blogs", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  useEffect(() => {
    fetchTrendingBlogs();
  }, []);

  
  return (
    <div className="home-container">
      <div className="blog-section">
        <h1 className="blog-section-header">Latest Blogs</h1>
        {blogs.map((blog, index) => (
          <div
            key={`${blog.blog_id}-${index}`}
            className="blog-card"
            ref={index === blogs.length - 1 ? lastBlogRef : null}
            
          >
            <div className="blog-info">
              <p className="blog-author">
                {blog.author?.personal_info?.username}
              </p>

            
            
            <div style={{ cursor: "pointer" }}
            onClick={() => navigate(`/blog/${blog.blog_id}`)}>
              <h2 className="blog-title">{blog.title}</h2>
              <p className="blog-desc">{blog.desc}</p>
            </div>
            <LikeButton blogId={blog._id} initialLikes={blog.total_likes} />
            </div>
            <img className="blog-banner" src={blog.banner} alt="banner" />
          </div>
        ))}
      </div>

      
     <div className="trending-section">
        <h2 className="trending-section-header">Trending</h2>
        {trendingBlogs.map((blog, index) => (
         <div key={`${blog.blog_id}-trending`} className="trending-blog">
         <p className="trend-position">{index + 1}.</p>
         <div
            style={{ cursor: "pointer", flex: 1 }}
            onClick={() => navigate(`/blog/${blog.blog_id}`)}
         >
         <p className="trend-title">{blog.title}</p>
         <p className="trend-author">
            {blog.author?.personal_info?.username}
         </p>
     </div>

    <LikeButton blogId={blog._id} initialLikes={blog.total_likes} />
  </div>
))}
</div>
    </div>
  );
};

export default Home;
