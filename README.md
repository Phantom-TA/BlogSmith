# 📝 BlogSmith

BlogSmith is a full-stack blogging platform built with modern web technologies. It supports secure user authentication, image-rich blogging, and seamless user experiences. Users can write, update, like, and delete posts, all while enjoying persistent sessions and secure access.

## Deployment Link 🔗
- https://blog-smith.vercel.app/

## 🚀 Features

- 🔐 JWT-based Authentication (Login & Register)
- 🔒 Protected Routes with Session Handling
- ✍️ Rich Text Editor (Tiptap) with Image Upload Support
- 🖼️ Cloudinary Integration for Media Storage
- ❤️ Like System (with Persistent State)
- 📬 RESTful API with Secure CRUD Operations
- 🧭 React Router-Based Navigation
- 🔗 MongoDB Atlas Integration
- 🌐 CORS, Cookies, and Token Management
- 🧰 Modular and Clean Frontend-Backend Architecture

## 🛠 Tech Stack

**Frontend**  
- React.js (v19+)  
- React Router  
- Tiptap Editor  
- Vite

**Backend**  
- Node.js  
- Express.js  
- MongoDB (via Mongoose)  
- JWT  
- bcryptjs  
- Cloudinary API  
- cookie-parser  
- dotenv


## 🧑‍💻 Getting Started

Follow these steps to run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/Phantom-TA/BlogSmith.git
cd BlogSmith-main
```
### 2. Install dependencies

```bash
#Install backend dependencies

cd server
npm install

# Install frontend dependencies

cd ../client
npm install
```

### 3.Run the Development Servers

```bash
# Start the backend server
cd ../server
npm start

# Start the frontend app
cd ../client
npm run dev
```



