const express = require("express")
const connectDB = require("./config/database")
const app = express()
const User = require("./models/user");

app.use(express.json());

//post api
app.post("/signup", async (req, res) => {
    //Create new instance of user
    const user = new User(req.body)

    await user.save();
    res.send("User has been saved");
});

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
app.patch("/user", async(req, res) => {
    const userId = req.body.userId;
    const data = req.body

    try {
        const user = await User.findByIdAndUpdate(userId, data, {
            returnDocument: "after",
            runValidators: true
        });

        res.send("User updated succesfully");
    } catch (error) {
        res.status(400).send("Something went wrong");
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

