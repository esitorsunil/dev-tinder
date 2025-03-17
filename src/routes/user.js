const express = require("express");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const {userAuth} = require("../middlewares/Auth");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"

userRouter.get("/user/request/received", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate(
            "fromUserId",
            USER_SAFE_DATA
        );

        res.json({
            message: "data fetched successfully",
            data: connectionRequests
        });
    } catch (err) {
        res.statusCode(400).send("ERROR :" + err.message);
    }
})

userRouter.get("/user/connection", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id, status: "accepted"},
                {toUserId: loggedInUser._id, status: "accepted"},
            ],
        }).populate( "fromUserId", USER_SAFE_DATA )
          .populate( "toUserId", USER_SAFE_DATA )

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }   
            return row.fromUserId;
        })
        res.json({ data });


    } catch (err) {
        res.statusCode(400).send("ERROR :" + err.message);
    }
})

userRouter.get("/feed", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [{fromUserId: loggedInUser._id}, {toUserId: loggedInUser._id},],
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();

        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } },
            ],
        }).select(USER_SAFE_DATA);

        res.send(users);
    } catch (err) {
        res.status(400).send("ERROR :" + err.message);
    }
})
module.exports = userRouter;