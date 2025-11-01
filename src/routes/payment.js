const express = require("express");
const { userAuth } = require("../middlewares/Auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants");
const { validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils");
const user = require("../models/user");

paymentRouter.post("/payment/create", userAuth, async(req, res) => {
    try {
      const {firstName, lastName, emailId} = req.user
      const {membershipType} = req.body 
        const orders = await razorpayInstance.orders.create({
            "amount": membershipAmount[membershipType] * 100,
            "currency": "INR",
            "receipt": "receipt#1",
            "notes": {
              firstName,
              lastName,
              emailId,
              membershipType: membershipType,
            }
          })
          //store in db
          const payment = new Payment({
            userId: req.user._id,
            orderId: orders.id,
            status: orders.status,
            amount: orders.amount,
            currency: orders.currency,
            receipt: orders.receipt,
            notes: orders.notes
          })

          const savedPayment = await payment.save();
          //return back my order to frontend
          res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID})

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


paymentRouter.post("/payment/webhook", async(req,res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");

    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      console.log("INvalid Webhook Signature");
      return res.status(400).json({ msg: "Webhook signature is invalid" });
    }
    console.log("Valid Webhook Signature");


      // Udpate my payment Status in DB
      const paymentDetails = req.body.payload.payment.entity;

      const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
      payment.status = paymentDetails.status;
      await payment.save();
      console.log("Payment saved");
  
      const user = await user.findOne({ _id: payment.userId });
      user.isPremium = true;
      user.membershipType = payment.notes.membershipType;
      console.log("User saved");
  
      await user.save();
  
      // Update the user as premium
  
      // if (req.body.event == "payment.captured") {
      // }
      // if (req.body.event == "payment.failed") {
      // }
  
      // return success response to razorpay
  
      return res.status(200).json({ msg: "Webhook received successfully" });


  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

module.exports = paymentRouter