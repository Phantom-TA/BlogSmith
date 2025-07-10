import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import apiClient from "../../service/apiClient";
import TiptapEditor from "../components/TipTapEditor.jsx"; 
import "../styles/Editor.css";

const Editor = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(blogId);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [banner, setBanner] = useState("");
  const [content, setContent] = useState(""); 

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "blogging/banners");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      setBanner(data.secure_url);
    } catch (err) {
      console.error("Banner upload failed:", err);
    }
  };

  const fetchBlog = async () => {
    try {
      const res = await apiClient.getBlogById(blogId);
      const blog = res.data.blog;
      setTitle(blog.title);
      setDesc(blog.desc);
      setBanner(blog.banner);
      setContent(blog.content);
    } catch (error) {
      console.error("failed to load blog", error);
    }
  };

  useEffect(() => {
    if (isEditing) fetchBlog();
  }, [blogId]);

  const handleSubmit = async (publish = true) => {
    const updatedBlog = {
      title,
      desc,
      banner,
      content,
      draft: !publish,
    };
    try {
      let response;
      if (isEditing) {
        response=await apiClient.editBlog(blogId, updatedBlog);
      } else {
        response= await apiClient.createBlog(updatedBlog);
      }
      if(response.success)
      navigate("/");
      else
      console.error("failed to publish",response.data.error)
    } catch (error) {
      console.error("Blog submit failed", error);
    }
  };

  return (
        <div className="editor-wrapper">
            <h2 className="editor-heading">{isEditing ? "Edit Blog" : "Create New Blog"}</h2>

            <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="editor-input title-input"
            />

            <input
            type="text"
            placeholder="Description (max 150 chars)"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            maxLength={150}
            className="editor-input desc-input"
            />

            <div className="banner-section">
                <label htmlFor="banner-upload">📷 Upload a banner image</label>
                <input type="file" id="banner-upload" onChange={handleBannerUpload} />
                {banner && <img src={banner} alt="Banner Preview" className="banner-preview" />}
            </div>

        
            {(!isEditing || content) && (
            <TiptapEditor content={content} setContent={setContent} />
              )}

            <div className="editor-buttons">
            {!isEditing && (
                <button onClick={() => handleSubmit(false)} className="draft-btn">
                Save as Draft
                </button>
            )}
            <button onClick={() => handleSubmit(true)} className="publish-btn">
            {isEditing ? "Update Blog" : "Publish Blog"}
            </button>
            </div>
        </div>

    ) ;
};

export default Editor;
