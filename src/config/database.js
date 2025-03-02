const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://maesitorsunil:hHCxW3Bj02xxj0H9@namastenode.h0eeh.mongodb.net/"
    )
}

connectDB().then(() => {
    console.log("Database has been established")
})
.catch((err) => {
    console.log("Database cannot be established")
})