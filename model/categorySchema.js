
const mongoose = require('mongoose');

const subProductSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  sub_name: { type: String },
  sub_image: { type: String },
  sub_price: { type: Number },
  sub_weight: { type: Number }
});

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  product_category_title: { type: String, required: true },
  product_name: { type: String, required: true },
  offer_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  pack_gram: { type: Number, required: true },
  description: { type: String},
  image: { type: String, required: true },
  sub_products: [subProductSchema]
});

const categorySchema = new mongoose.Schema({
  id: { type: Number, required: true }, 
  category_title:{type: String, required:true},
  category_name: { type: String, required: true },
  category_image: { type: String, required: true },
  category_items: [productSchema] 
});

const Product=mongoose.model('Product',productSchema)
const Category = mongoose.model('Category', categorySchema);
module.exports = {
  Category,
  Product 
};
