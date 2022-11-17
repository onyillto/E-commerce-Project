//Cart Route
const route = require('express').Router();
const Cart = require('../models/Cart');
const {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin} = require('./verifyToken') //import jwt verification token

//Create new cart
route.post('/',verifyToken,async (req,res)=>{
    
   const newCart = new Cart(req.body) //Cart schema imported
   try {
    const savedCart = await newCart.save() ;
    res.status(200).json(savedCart); 
   } catch (err) {
    res.status(500).json(err)
   }
});


//Update Cart
route.put('/:id',verifyTokenAndAuthorization,async (req,res)=>{
    //check password and encrypt
    
    try {
        //User schema imported
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id,
            {
            $set: req.body //set new information on the body to user
        },
        {new:true}//To set the updated new user body on the client side
        );
        res.status(200).json(updatedCart)
    } catch (err) {
        res.status(500).json(err)
        
    }
});


//Delete Cart
route.delete('/:userId', verifyTokenAndAuthorization, async(req,res)=>{
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart Deleted...")

    } catch (err) {
        res.status(500).json(err)
    }
})


//Get User Cart
route.get('/find/:id',verifyTokenAndAuthorization, async(req,res)=>{
    try {
        const cart = await Cart.find({userId: req.params.userId});
        res.status(200).json(cart); //sending all except password
        console.log('Cart gotten')

    } catch (err) {
        res.status(500).json(err)
    }
})

//Admin get all cart
route.get("/",verifyTokenAndAdmin,async(req,res)=>{
    try {
        const carts = await Cart.find()
        res.status(200).json(carts)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = route