const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        default: "" 
    },
    telephone: {
        type: Number,
        default: null 
    },
    landmark: {
        type: String,
        default: "" 
    },
    postal_code: {
        type: Number,
        default: null 
    },
    password: {
        type: String,
        required: true
    },
    cartData: {
        type: Object,
        default: {}
    },
    orders:  [{ 
        order_items: [{
            product: { type: Number, required: true },
            quantity: { type: Number, required: true }
        }],
        total_amount: { type: Number }, 
        payment_method: { type: String },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    date: {
        type: Date,
        default: Date.now
    }
});


const Users=mongoose.model('Users',userSchema)
module.exports=Users