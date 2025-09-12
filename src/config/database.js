const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://maesitorsunil:hHCxW3Bj02xxj0H9@namastenode.h0eeh.mongodb.net/devTinder"
    )
}

module.exports = connectDB;
