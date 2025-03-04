const mongoose = require("mongoose");
const validator = require("validator");

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
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address"+ value)
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter strong password"+ value)
        }
    },
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
        default: "https://image.pngaaa.com/853/3873853-middle.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL"+ value)
        }
    },
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
},
{
    timestamps: true
}

);

module.exports = mongoose.model("user", userSchema);