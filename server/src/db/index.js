import mongoose from "mongoose"

const connectDb = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDb connected successfully")

    } catch (error) {
        console.error("MongoDb connected failed",error)
        process.exit(1);
    }
}
export default connectDb