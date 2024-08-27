const mongoose=require('mongoose')

const flashSaleSchema=new mongoose.Schema({
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

const Flashsale=mongoose.model('Flashsale',flashSaleSchema)
module.exports=Flashsale