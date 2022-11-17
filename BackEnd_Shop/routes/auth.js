//Authentication route
const route = require('express').Router();
const User = require('../models/User')
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
//Register user
route.post('/register', async(req,res)=>{
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password:CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_ENCRYPT_KEY).toString() ,//crypto js middle ware to encrypt the user password 
       
    });
    //after getting user input then we use async method to save the user on the data base using trycatch for both saving user and to catch any error
    try {
       const savedUser = await newUser.save();
       res.status(201).json(savedUser)
    } catch (err) {
        res.status(500).json(err)
    }
})






route.post('/login', async (req, res) => {
    try{
        const user = await User.findOne(
            {
                userName: req.body.user_name
            }
        );

        !user && res.status(401).json("Wrong User Name");
            // Decrypt password
        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASSWORD_ENCRYPT_KEY
        );

        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        const inputPassword = req.body.password;
        

        const accessToken = jwt.sign(  //access token called
        {
            id: user._id,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SEC,
            {expiresIn:"3d"}
        );
  
        const { password, ...others } = user._doc;  //_doc was used because that the path where mongoose stores our input
        res.status(200).json({...others, accessToken}); //so we are sending all user details except password

    }catch(err){
        res.status(500).json(err);
    }

});
module.exports = route