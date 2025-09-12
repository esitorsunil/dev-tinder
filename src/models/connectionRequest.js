const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    status: {
        type: String,
        required: true,
        enum:{ 
            values: ["ignore","interested", "accepted", "rejected"],
            message:"{VALUE} is not supported"
        }
    }
},
{
    timestamps: true
}
);

connectionRequestSchema.index({fromUserId: 1, toUserId: 1} );

connectionRequestSchema.pre("save", function(next) {
    const connectionRequest = this;
    //check if the fromUserid is equal to toUserid
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself");
    }
    next();
})

const ConnectionRequest = mongoose.model("connectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest