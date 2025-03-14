const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/Auth")
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req, res) => {
    try{
        const fromUserId = req.user.id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignore", "interested"];

        if(!allowedStatus.includes(status)) {
            return res.status(400).json({message: "Invalid Status type: "+ status});
        }

        //if there is exiting connection Request
        const existingConnectionRequest = await ConnectionRequest.findOne({
          $or: [
            {fromUserId, toUserId}, 
            {fromUserId: toUserId, toUserId: fromUserId},
          ],
        });

        if(existingConnectionRequest) {
            return res.status(400).json({message: "Request already exists"});
        }

        const toUser = await User.findById(toUserId);

        if(!toUser) {
            return res.status(400).json({message: "User not found"});
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
      const data =  await connectionRequest.save();

        res.json ({
            message: req.user.firstName + " is " +status+ " to " + toUser.firstName,
            data
        });

    } catch (err) {
        res.status(400).send("ERROR :" + err.message);
    }
})

module.exports = requestRouter;