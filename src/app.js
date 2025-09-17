const express = require("express")
const connectDB = require("./config/database")
const app = express()
const cookieParser = require("cookie-parser");
const cors = require("cors")
require("dotenv").config();

const PORT = process.env.PORT || 3000;

// --- CORS ---
const allowedOrigins = [
    "http://localhost:5173",
    "https://sunil-devtinder.netlify.app"
  ];
  
  app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }));
  
  // Handle preflight requests
  app.options("*", cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }));
app.use(express.json());
app.use(cookieParser());


const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter)

connectDB().then(() => {
    console.log("Database has been established");
    app.listen(PORT, () => {
        console.log("The port is running successfully");
    });
})
.catch((err) => {
    console.log("Database cannot be established")
});

