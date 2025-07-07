import express from "express"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import cors from "cors"
const app = express();

console.log("CLIENT_URI:", process.env.CLIENT_URI);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "https://localhost:5173/",
  credentials: true
}));
app.use("/api", authRoutes)


export default app;