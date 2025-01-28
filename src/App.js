const express = require("express")

const app = express()

app.get("/user", (req, res) => {
    res.send({firstName: "Sunil", lastName: "Ferno"})
})

app.post("/user", (req, res) => {
    res.send("User connected to the DB")
})

app.delete("/user", (req, res) => {
    res.send("Deleted successfully")
})

app.use("/", (req, res) => {
    res.send("This is my dashboard")
})

app.listen(3000, () => {
    console.log("The port is running successfully")
})