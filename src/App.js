const express = require("express")

const app = express()

app.use("/test", (req, res) => {
    res.send("Hello from the server")
})

app.use("/", (req, res) => {
    res.send("This is my dashboard")
})

app.listen(3000, () => {
    console.log("The port is running successfully")
})