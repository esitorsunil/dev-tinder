const express = require("express")

const app = express()

const {adminAuth, userAuth} = require("./middlewares/Auth")

app.use("/admin", adminAuth)

app.post("/user/login", (req, res) => {
    res.send("user login successfully")
})

app.get("/user/data",userAuth, (req, res) => {
    res.send("get user data")
});



app.get("/admin/getALlData", (req, res) => {
    res.send("Get all data")
});

app.get("/admin/deleteData", (req, res) => {
    res.send("Delete all data")
});

app.listen(3000, () => {
    console.log("The port is running successfully")
})