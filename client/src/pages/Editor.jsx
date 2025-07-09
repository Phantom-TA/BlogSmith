import { useState } from "react";
import { useNavigate, useParams } from "react-router"
import apiClient from "../../service/apiClient";
import ReactQuill from 'react-quill'
import "react-quill/dist/quill.snow.css";
import { useEffect } from "react";

const Editor =()=>{
    const {blogId} =useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(blogId);

    const [title , setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [banner, setBanner] = useState("");
    const [content, setContent] = useState("");

    const quillRef = useRef();

    const modules = {
        toolbar: {
            container: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
            ],
            handlers: {
                image: imageHandler,
            },
        },
    };

    function imageHandler() {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "your_upload_preset");

            try {
                const res = await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", {
                method: "POST",
                body: formData,
                });
                const data = await res.json();
                const editor = quillRef.current.getEditor();
                const range = editor.getSelection();
                editor.insertEmbed(range.index, "image", data.secure_url);
            } 
            catch (error) {
                console.error("Image upload failed", error);
            }
        };
    }

    const handleBannerUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "YOUR_UPLOAD_PRESET");

        try {
            const res = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            setBanner(data.secure_url);
        } catch (err) {
            console.error("Banner upload failed:", err);
        }
    };


    const fetchBlog = async() =>{
        try {
            const res = await apiClient.getBlogById(blogId)
            const blog = res.data.blog;
            setTitle(blog.title)
            setDesc(blog.desc)
            setBanner(blog.banner)
            setContent(blog.content)
           
        } catch (error) {
            console.error("failed to load blog",error)

        }
    }
    useEffect(()=>{
        if(isEditing)
            fetchBlog();

    },[blogId])

    const handleSubmit = async (publish =true )=>{
        const updatedBlog ={
            title,
            desc,
            banner,
            content,
            draft:!publish
        }
        try {
            if(isEditing)
                await apiClient.editBlog(blogId,updatedBlog)
            else
                await apiClient.createBlog(updatedBlog)
            navigate('/')
        } catch (error) {
            console.error("Blog submit failed",error)
        }
    }

    return (
        <div className="editor-container">
            <h2>{isEditing ?"Edit Blog" : "Create new Blog"}</h2>

            <input 
            type="text" 
            placeholder="Title"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            />

            <input 
            type="text"
            placeholder="Description (max 150 chars)"
            value={desc}
            onchange={(e)=>setDesc(e.target.value)}
            maxLength={150}
             />
            
            <input type="file" onChange={handleBannerUpload} />
            {banner && <img src={banner} alt="Banner Preview" className="banner-preview" />}

            <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                ref={quillRef}
                placeholder="Write your blog content here..."
            />

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
    )
}
export default Editor;