const express = require("express")

const app = express()

app.use("/", (err,req,res,next) => {
    if(err) {
        res.status(500).send("Something went wrong")
    }
})

app.get("/getUserData", (req, res) => {
    //try{
    //Logic of DB call

    throw new Error("sbdshfgre")
    res.send("Hello");

    //catch(err) {
    //log your error
    //res.status(500).send("Something went wrong")
    //}
})

app.use("/", (err, req, res, next) => {
    if(err) {
        //log your error
        res.status(500).send("Something went wrong")
    }
})

app.listen(3000, () => {
    console.log("The port is running successfully")
})