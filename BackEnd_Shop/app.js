const dotenv = require('dotenv')
const express = require("express");
const bodyParser = require('body-parser')
const connectDB = require('./config/db'); //Bring on the db from config folder
const userRoute = require('./routes/user')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')
const morgan = require('morgan')

const authRoute = require('./routes/auth')
const app = express()


//load morgan
app.use(morgan('tiny'))

//Load config
dotenv.config({path: './config/.env'})
//call db imported 
connectDB();
const PORT = 5000;


app.use(express.json())
app.use('/api/user',userRoute)
app.use('/api/product',productRoute)
app.use('/api/product',cartRoute)
app.use('/api/product',orderRoute)
app.use('/api/auth',authRoute)


app.listen(PORT, () => console.log(`Server Connected to port ${PORT}`))