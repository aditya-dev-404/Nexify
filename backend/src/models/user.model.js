import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        public_id: {
            type: String,
            default: ""
        },
        url: {
            type: String,
            default: "https://static.vecteezy.com/system/resources/previews/024/983/914/non_2x/simple-user-default-icon-free-png.png"
        }
    },
    coverImage: {
        public_id: {
            type: String,
            default: ""
        },
        url: {
            type: String,
            default: "https://flowbite.com/docs/images/examples/image-3@2x.jpg"
        }
    },
    headings: {
        type: String,
        default: ""
    },
    skills: [{ type: String }],
    education: [
        {
            college: {
                type: String,
                default: ""
            },
            degree: {
                type: String,
            },
            fieldOfStudy:
                { type: String }
        }
    ],
    location: {
        type: String,
        default: "India"
    },
    gender: {
        type: String,
        default: "",
        enum: ['male', 'female', 'others','']
    },
    exprience: [{
        title: { type: String },
        company: { type: String },
        description: { type: String }
    }],
    connections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, { timestamps: true })

const User = mongoose.model("User", userSchema);
export default User
