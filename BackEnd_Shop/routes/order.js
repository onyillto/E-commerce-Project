//Order Route
const route = require('express').Router();
const Order = require('../models/Order');
const {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin} = require('./verifyToken') //import jwt verification token

//Create new Order
route.post('/',verifyToken,async (req,res)=>{
    
   const newOrder = new Order(req.body) //Order schema imported
   try {
    const savedOrder = await newOrder.save() ;
    res.status(200).json(savedOrder); 
   } catch (err) {
    res.status(500).json(err)
   }
});


//Update Order
route.put('/:id',verifyTokenAndAdmin,async (req,res)=>{
    //check password and encrypt
    
    try {
        //User schema imported
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id,
            {
            $set: req.body //set new information on the body to user
        },
        {new:true}//To set the updated new user body on the client side
        );
        res.status(200).json(updatedOrder)
    } catch (err) {
        res.status(500).json(err)
        
    }
});


//Delete Order
route.delete('/:userId', verifyTokenAndAdmin, async(req,res)=>{
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order Deleted...")

    } catch (err) {
        res.status(500).json(err)
    }
})


//Get User Order
route.get('/find/:id',verifyTokenAndAuthorization, async(req,res)=>{
    try {
        const orders = await Order.find({userId: req.params.userId});
        res.status(200).json(orders); //sending all except password
        console.log('Order gotten')

    } catch (err) {
        res.status(500).json(err)
    }
})

//Admin get all Order
route.get("/",verifyTokenAndAdmin,async(req,res)=>{
    try {
        const orders = await Order.find()
        res.status(200).json(orders)
    } catch (err) {
        res.status(500).json(err)
    }
})



// GET MONTHLY INCOME

route.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));// a month from today
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));//2 month from today
  
    try {
      const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  module.exports = route;