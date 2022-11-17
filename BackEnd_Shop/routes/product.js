//User Route
const route = require('express').Router();
const Product = require('../models/Product');
const {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin} = require('./verifyToken') //import jwt verification token


//Post new product
route.post('/',verifyTokenAndAdmin,async (req,res)=>{
    
   const newProduct = new Product(req.body) //Product schema imported
   try {
    const savedProduct = await newProduct.save() ;
    res.status(200).json(savedProduct); 
   } catch (err) {
    res.status(500).json(err)
   }
})

//Update Product
route.put('/:id',verifyTokenAndAdmin,async (req,res)=>{
    //check password and encrypt
    
    try {
        //User schema imported
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,
            {
            $set: req.body //set new information on the body to user
        },
        {new:true}//To set the updated new user body on the client side
        );
        res.status(200).json(updatedProduct)
    } catch (err) {
        res.status(500).json(err)
        
    }
})

//Delete Product
route.delete('/:id', verifyTokenAndAdmin, async(req,res)=>{
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product Deleted...")

    } catch (err) {
        res.status(500).json(err)
    }
})

//Get Product
route.get('/find/:id', async(req,res)=>{
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product); //sending all except password
        console.log('product gotten')

    } catch (err) {
        res.status(500).json(err)
    }
})

//Get All Product
//NOTE:when theres a query new true then only the latest products posted on the db will see sent to user but if query categories have the element in the array of product in the categories then all element with such item is found
route.get('/products', async(req,res)=>{
    const queryNew = req.query.new;//fetch data with created at date(new)by 5 of them 
    const queryCategory = req.query.category;//fetch by our category


    try {
        let products;
        if(queryNew){
            products = await Product.find().sort({createdA: -1}).limit(5)
        }else if(queryCategory){
            products = await Product.find({
                categories:{
                    $in:[queryCategory],
                },
            })//if the category queries created here is inside the categories schema array then we patch this product
        }else{
            products = await Product.find()
        }//if no query then all product in our DB
        
        res.status(200).json(products); //sending all except password
        console.log('All product displayed')

    } catch (err) {
        res.status(500).json(err)
    }
}) 

  
module.exports = route