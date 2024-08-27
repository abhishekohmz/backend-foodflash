const mongoose = require('mongoose')

const dailyDealSchema = new mongoose.Schema({
        productId: mongoose.Schema.Types.ObjectId,
        id: Number,
        description: String,
        image: String,
        offer_price: Number,
        old_price: Number,
        pack_gram: Number,
        product_category_title: String,
        product_name: String,
        sub_products: Array,
})

const DailyDeal=mongoose.model('DailyDeal',dailyDealSchema)
module.exports=DailyDeal