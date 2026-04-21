import app from "../server/src/app.js";
import connectDb from "../server/src/db/index.js";
import dotenv from "dotenv";

dotenv.config();

// Connect to database
connectDb().catch(err => {
    console.error("Database connection failed", err);
});

export default app;
