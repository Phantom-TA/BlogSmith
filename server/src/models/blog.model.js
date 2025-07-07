import mongoose, { Schema } from "mongoose";

const blogSchema = new mongoose.Schema({
        blog_id:{
            type:String,
            required:true,
            unique:true
        },
        title:{
            type:String,
            required:true
        },
        banner:{
            type:String
        },
        desc:{
            type:String,
            maxlength:150
        },
        tags:{
            type:[String]
        },
        content:{
            type:[]
        },
        author:{
            type:  Schema.Types.ObjectId ,
            ref: 'User',
            required:true
        },
        total_likes : {
                type:Number,
                default:0
        },
        liked_by :{
            type: [Schema.Types.ObjectId],
            ref: 'User',
            default: []
        },
        draft:{
            type:Boolean,
            default:false
        }
},{
    timestamps:{
        createdAt: 'publishedAt'
    }
})

export const Blog = mongoose.model('Blog', blogSchema);