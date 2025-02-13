const express = require("express")

const app = express()



app.use("/user", [(req, res, next) => {
   console.log("This is my dashboard")
   //res.send("Hello");
   next();
}, (req, res, next) => {
   // res.send("2nd response")
    next();
}], (req, res) => {
    res.send("3rd response")
}, (req, res) => {
    res.send("4th response")
})

app.listen(3000, () => {
    console.log("The port is running successfully")
})