const express = require("express")
const connectDB = require("./config/database")
const app = express()
const User = require("./models/user");


app.post("/signup", async (req, res) => {
    const user = new User ({
        firstName: "Sunil",
        lastName: "Rio",
        emailId: "sunilrio23@gmail.com",
        password: "sunil@123",
    });

    await user.save();
    res.send("User has been saved");
});

connectDB().then(() => {
    console.log("Database has been established");
    app.listen(3000, () => {
        console.log("The port is running successfully");
    });
})
.catch((err) => {
    console.log("Database cannot be established")
});

