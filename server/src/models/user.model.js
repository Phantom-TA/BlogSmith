import mongoose,{Schema} from "mongoose";
import bcrypt from 'bcryptjs'

let profile_imgs_name_list = [
  "Garfield",
  "Tinkerbell",
  "Annie",
  "Loki",
  "Cleo",
  "Angel",
  "Bob",
  "Mia",
  "Coco",
  "Gracie",
  "Bear",
  "Bella",
  "Abby",
  "Harley",
  "Cali",
  "Leo",
  "Luna",
  "Jack",
  "Felix",
  "Kiki",
];
let profile_imgs_collections_list = [
  "notionists-neutral",
  "adventurer-neutral",
  "fun-emoji",
];

const userSchema = new mongoose.Schema({
    personal_info:{
        fullname : {
            type:String,
            
            required:true,
            
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true
        },
        password:{
            type:String,
            required:true
        },
        username:{
            type:String,
            unique:true
        },
        bio:{
            type:String,
            maxlength: [200, 'Bio should not be more than 200'],
            default: "",
        },
        profile_img:{
            type:String,
            default: () => {
                return `https://api.dicebear.com/6.x/${
                profile_imgs_collections_list[
              Math.floor(Math.random() * profile_imgs_collections_list.length)
                ]
                }/svg?seed=${
                  profile_imgs_name_list[
                  Math.floor(Math.random() * profile_imgs_name_list.length)
                ]
            }`;
            },
        }

    } ,
    account_info:{
        total_posts: {
            type: Number,
            default: 0
        },
        total_reads: {
            type: Number,
            default: 0
        },
    },
    google_auth: {
        type: Boolean,
        default: false
    },
    blogs: {
        type: [ Schema.Types.ObjectId ],
        ref: 'Blog',
        default: [],
    }

},{
    timestamps:{
        createdAt: 'joinedAt'
    }
})



userSchema.pre("save",async function(next){
     if(!this.isModified("personal_info.password")) 
        return next();
    this.personal_info.password = await bcrypt.hash(this.personal_info.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password) {
    
    return await bcrypt.compare(password, this.personal_info.password);
}

export const User = mongoose.model('User', userSchema);