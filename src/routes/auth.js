const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const {validateSignupData} = require("../utils/validation");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
    try {
    //Validation of data
    validateSignupData(req);

    const {firstName, lastName, emailId, password} = req.body;

    //Encrpt your password
    const passwordHash = await bcrypt.hash(password, 10);

    //Create new instance of user
    const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash
    });

    
    await user.save();
    res.send("User has been saved");
    } catch (err) {
        res.status(400).send("ERROR :" + err.message);
    }
});

authRouter.post("/login", async (req, res)=> {
    try {
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId : emailId});

        if(!user) {
            throw new Error("Invalid Credintials");
        } else {
            const isPasswordValid = await user.validatePassword(password);

            if(isPasswordValid) {
                //Create a JWT Token

                const token = await user.getJWT();

                //Add the token to the cookie and send response to the user
                res.cookie("token", token, {
                    expires: new Date(Date.now() + 8 * 3600000)
                });
                res.send("Login Successfully");
            } else {
                throw new Error("Invalid Credintials");
            }
        }
        
    } catch (err) {
        res.status(400).send("ERROR :" + err.message);
    }
})

authRouter.post("/logout", async(req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout successfull");
});

module.exports = authRouter;