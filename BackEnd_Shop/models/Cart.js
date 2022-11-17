//User Cart schema:Every user have one cart

const mongoose = require('mongoose');


const CartSchema = new mongoose.Schema(
    {
        userId:{type:String, required: true},
        products:[
            {
                productId:{
                    type: String,
                },
                quantity:{
                    type: Number,
                    default:1,
                }
            }
        ],
    },
    {timestamps:true}
)

module.exports = mongoose.model("Cart", CartSchema)