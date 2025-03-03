const express = require("express")
const connectDB = require("./config/database")
const app = express()

connectDB().then(() => {
    console.log("Database has been established");
    app.listen(3000, () => {
        console.log("The port is running successfully");
    });
})
.catch((err) => {
    console.log("Database cannot be established")
});

