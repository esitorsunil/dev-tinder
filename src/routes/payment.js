const express = require("express");
const { userAuth } = require("../middlewares/Auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants");

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

module.exports = paymentRouter