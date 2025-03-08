const express = require("express")
const connectDB = require("./config/database")
const app = express()
const User = require("./models/user");
const {validateSignupData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const {userAuth} = require("./middlewares/Auth")

app.use(express.json());
app.use(cookieParser());

//post api
app.post("/signup", async (req, res) => {
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

//post login
app.post("/login", async (req, res)=> {
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

app.get("/profile", userAuth, async(req, res) => {
    try {
        const user = req.user

    res.send(user);
    } catch (err) {
        res.status(400).send("ERROR :" + err.message);
    }
})

app.post("/sendConnectionRequest", userAuth, async(req, res) => {
    const user = req.user;
    res.send(user.firstName + "sent the connection request");
})
//Get one user
app.get("/user", async(req, res) => {
    const userEmail = req.body.emailId;

    try{
        const user = await User.findOne({emailId: userEmail});
        res.send(user);
    } catch(err) {
        res.status(400).send("Something went wrong");
    }
})
//Get all users
app.get("/feed", async(req, res) => {
    try{
        const user = await User.find({});
        res.send(user);
    }catch(err) {
        res.status(400).send("Something went wrong");
    }
})

//delete api
app.delete("/user", async(req, res) => {
    const userId = req.body.userId;

    try {
        const user = await User.findByIdAndDelete(userId);

        res.send("User deleted succesfully");
    } catch (error) {
        res.status(400).send("Something went wrong");
    }
})

//update API
app.patch("/user/:userId", async(req, res) => {
    const userId = req.params?.userId;
    const data = req.body

    try {
        const ALLOWED_UPDATE = [
            "photoUrl", 
            "about", 
            "skills", 
            "gender", 
            "age"
        ];

        const isUpdateAllowed = Object.keys(data).every((k) => 
            ALLOWED_UPDATE.includes(k)
        );
      
        if(!isUpdateAllowed) {
            throw new Error("Update not allowed")
        }

        if(data?.skills.length > 10) {
            throw new Error("Too many skills not allowed")
        }

        const user = await User.findByIdAndUpdate({_id:userId}, data, {
            returnDocument: "after",
            runValidators: true
        });

        res.send("User updated succesfully");
    } catch (err) {
        res.status(400).send("Update FAILED:"+ err.message);
    }
})

connectDB().then(() => {
    console.log("Database has been established");
    app.listen(3000, () => {
        console.log("The port is running successfully");
    });
})
.catch((err) => {
    console.log("Database cannot be established")
});

