const express = require("express");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const {userAuth} = require("../middlewares/Auth");

userRouter.get("/user/request/received", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate(
            "fromUserId",
            "firstName lastName photoUrl age gender about skills"
        );

        res.json({
            message: "data fetched successfully",
            data: connectionRequests
        });
    } catch (err) {
        req.statusCode(400).send("ERROR :" + err.message);
    }
})

module.exports = userRouter;