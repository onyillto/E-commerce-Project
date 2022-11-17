//User Route
const route = require('express').Router();
const User = require('../models/User');
const {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin} = require('./verifyToken') //import jwt verification token

route.put('/:id',verifyTokenAndAuthorization,async (req,res)=>{
    //check password and encrypt
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_ENCRYPT_KEY).toString(); //crypto js middle ware to encrypt the user password 
    } 
    try {
        //User schema imported
        const updatedUser = await User.findByIdAndUpdate(req.params.id,
            {
            $set: req.body //set new information on the body to user
        },
        {new:true}//To set the updated new user body on the client side
        );
        res.status(200).json(updatedUser)
    } catch (err) {
        res.status(500).json(err)
        
    }
})

//on the id param,verify user and then go to database find user with given id then delete
route.delete('/:id', verifyTokenAndAdmin, async(req,res)=>{
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User Deleted...")

    } catch (err) {
        res.status(500).json(err)
    }
})

//Get user,on the given params
route.get('/find/:id', verifyTokenAndAdmin, async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;  //mongoose path
        res.status(200).json(others); //sending all except password
        console.log('done')

    } catch (err) {
        res.status(500).json(err)
    }
})


//Get all user
route.get('/users', verifyTokenAndAdmin, async(req,res)=>{
    const query = req.query.new;//once there's a new query then we display the latest queries

    try {
        const users = query ? await User.find().sort({_id:-1}).limit(5) : await User.find(); //after checking for query,either return first 5 user all display all
        
        res.status(200).json(users); //sending all except password
        console.log('done')

    } catch (err) {
        res.status(500).json(err)
    }
})


//Get total number of user per month within a year
route.get('/users', verifyTokenAndAdmin, async(req,res)=>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1) )//last year today

    try {
        const data = await User.aggregate([
            //within a year from today
            { $match: { createdAt: {$gte: lastYear}}},//gte=greater than lastyear
            {
                // month created
                $project:{
                    month: {$month: "$createdAt"},//take the month at created at date
                },
            },
            {   //user
                $group: {
                    _id: "$month",
                    total: {$sum: 1},//add all registered voter
                }
            }
        ]);
        res.status(200).json(data); //sending all except password
        console.log('done')
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = route