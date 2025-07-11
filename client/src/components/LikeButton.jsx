
import { useLikes } from "../context/LikesContext";
import redHeart from "/heart-red.png";
import blackHeart from "/heart-black.png";

const LikeButton = ({ blogId, initialLikes }) => {
  const { likedBlogIds, blogLikes, toggleLike, isAuthenticated } = useLikes();

  const isLiked = likedBlogIds.includes(blogId);
  const likes = blogLikes[blogId] ?? initialLikes;

  const handleClick = async () => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    await toggleLike(blogId); 
  };

  return (
    <div
      onClick={handleClick}
      style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
    >
      <img src={isLiked ? redHeart : blackHeart} alt="like" width="20" height="20" />
      <span>{likes}</span>
    </div>
  );
};

export default LikeButton;
