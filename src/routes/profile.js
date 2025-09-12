const express = require("express")
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/Auth")
const {validateEditProfileData} = require("../utils/validation")
const User = require("../models/user");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async(req, res) => {
    try {
        const user = req.user

    res.send(user);
    } catch (err) {
        res.status(400).send("ERROR :" + err.message);
    }
})

profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
    try {
        if(!validateEditProfileData(req)){
            throw new Error ("Invalid Edit Request");
        }
        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, "your profile has been updated successfully"`,
            user: loggedInUser,
        });
    } catch (err) {
        res.status(400).send( err.message);
    }
})

profileRouter.patch("/profile/password",userAuth, async(req, res) => {
    const { password, newPassword } = req.body;
  const userId = req.user.id; // Extract user ID from JWT

  try {
    // Find the logged-in user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify the existing password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = profileRouter;



