import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    author : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description : {
        type : String,
        default : ''
    },
    images: [{
        public_id : {
            type : String,
            default: '',
        },
        url: {
            type: String,
            default:''
        }
    }],
    likes: [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments: [
        {
            content: {
                type : String,
            },
            user : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ]
},{timestamps:true})

const Post = mongoose.model('Post', postSchema);
export default Post