//Product schema

const mongoose = require('mongoose');


const CartSchema = new mongoose.Schema(
    {
        title:{type:String, required: true, unique:true},
        desc:{type:String, required: true},
        img:{type:String, required: true},
        categories:{type:Array},
        size:{type:String},
        color:{type:String, required: true, unique:true},
        price:{type: Number, required: true, unique:true},
    },
    {timestamps:true}
)

module.exports = mongoose.model("product", CartSchema)