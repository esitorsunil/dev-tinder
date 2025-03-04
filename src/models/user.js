const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 20
    },
    lastName: {
        type: String,
        minLength: 4,
        maxLength: 20
    },
    emailId: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 20
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Invalid gender")
        }
    },
},  
    photoUrl: {
        type: String,
        default: "https://image.pngaaa.com/853/3873853-middle.png"
    },
    about: {
        type: String,
        default: "This is a default about of the user",
        minLength: 10,
        maxLength: 200
    },
    skills: {
        type: [String]
    },
},
{
    timestamps: true
}
);

module.exports = mongoose.model("user", userSchema);