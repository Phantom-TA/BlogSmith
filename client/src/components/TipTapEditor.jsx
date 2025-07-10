import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import '../styles/TiptapEditor.css'

const TiptapEditor = ({ content, setContent }) => {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content,
    onUpdate({ editor }) {
      setContent(editor.getHTML())
    },
  })

  const handleImageUpload = () => {
    const input = document.createElement("input")
    input.setAttribute("type", "file")
    input.setAttribute("accept", "image/*")
    input.click()

    input.onchange = async () => {
      const file = input.files[0]
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be less than 5MB")
        return
      }

      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
      formData.append("folder", "blogging/content")

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        )
        const data = await res.json()
        editor.commands.setImage({ src: data.secure_url })
      } catch (err) {
        console.error("Image upload failed", err)
      }
    }
  }

  if (!editor) return null

  return (
    <div className="tiptap-wrapper">
      <div className="tiptap-toolbar">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          H2
        </button>
        <button onClick={handleImageUpload}>Image</button>
      </div>

      <EditorContent editor={editor} className="tiptap-editor" />
    </div>
  )
}

export default TiptapEditor
