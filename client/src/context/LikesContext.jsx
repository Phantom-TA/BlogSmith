
import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../../service/apiClient";
import { useNavigate } from "react-router";
import { useAuth } from "./authContext";

const LikesContext = createContext();

export const LikesProvider = ({ children }) => {
  const [likedBlogIds, setLikedBlogIds] = useState([]);
  const [blogLikes, setBlogLikes] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchLikes = async () => {
      if (!user) {
        setLikedBlogIds([]);
        setBlogLikes({});
        setIsAuthenticated(false);
        return;
      }

      try {
        const res = await apiClient.likedBlogs();

        if (res.success && res.data?.likedBlogIds) {
          setLikedBlogIds(res.data.likedBlogIds);
          setIsAuthenticated(true);

          if (res.data.blogLikes) {
            setBlogLikes(res.data.blogLikes);
          }
        } else {
          setLikedBlogIds([]);
          setBlogLikes({});
          setIsAuthenticated(false);
        }
      } catch (err) {
        setLikedBlogIds([]);
        setBlogLikes({});
        setIsAuthenticated(false);
      }
    };

    fetchLikes();
  }, [user]);

  const toggleLike = async (blogId) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      const res = await apiClient.likeBlog(blogId);

      if (res.success && typeof res.data.total_likes === "number") {
        setLikedBlogIds((prev) =>
          prev.includes(blogId)
            ? prev.filter((id) => id !== blogId)
            : [...prev, blogId]
        );

        setBlogLikes((prev) => ({
          ...prev,
          [blogId]: res.data.total_likes
        }));

        return res.data.total_likes;
      }
    } catch (err) {
      console.error("Like error:", err);
      navigate("/login");
    }
  };

  return (
    <LikesContext.Provider
      value={{ likedBlogIds, blogLikes, toggleLike, isAuthenticated }}
    >
      {children}
    </LikesContext.Provider>
  );
};

export const useLikes = () => useContext(LikesContext);
