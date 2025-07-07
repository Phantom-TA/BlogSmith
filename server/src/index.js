import app from "./app.js"
import dotenv from "dotenv"
import connectDb from "./db/index.js"

dotenv.config();

const PORT = process.env.PORT || 3000;
connectDb()
.then(()=> {
    app.listen(PORT ,()=>{
        console.log(`Server is running on port: ${PORT}`)

    })
})
.catch((error) => {
    console.error("MondoDb connection error",error);
    process.exit(1)
})