const { Category } = require("../model/categorySchema");
const DailyDeal = require("../model/dailyDealSchema");
const Flashsale = require("../model/flashSale");


// add category
exports.addCategory = async (req, res) => {
    try {
        let categories = await Category.find({})
        let id;

        if (categories.length > 0) {
            let last_category = categories[categories.length - 1];
            id = last_category.id + 1;
        } else {
            id = 1;
        }

        const { category_title, category_name, category_image } = req.body;

        const category = new Category({
            id: id,
            category_title: category_title,
            category_name: category_name,
            category_image: category_image
        });

        await category.save();
        res.json({
            success: true,
            category_name: category_name
        });
    } catch (error) {
        console.error('Error saving category:', error);
        res.status(500).json({ success: false, message: 'Error saving category', error: error.message });
    }
}


// get categories
exports.getCategory = async (req, res) => {
    let products = await Category.find({})
    console.log(products);
    res.send(products)
}

// remove catgory
exports.removeCategory = async (req, res) => {
    try {
        await Category.findOneAndDelete({ id: req.body.id });
        console.log('Category removed');
        res.json({
            success: true,
            category_name: req.body.category_name
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

// add products
exports.addProduct = async (req, res) => {
    try {
        const categoryId = parseInt(req.params.categoryId);
        const productData = req.body;

        if (isNaN(categoryId)) {
            return res.status(400).json({ success: false, message: 'Invalid category ID' });
        }

        const category = await Category.findOne({ id: categoryId });

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        let newProductId = categoryId * 100;
        if (category.category_items.length > 0) {
            const lastProduct = category.category_items[category.category_items.length - 1];
            newProductId = lastProduct.id + 1;
        } else {
            newProductId = categoryId * 100 + 1;
        }

        productData.id = newProductId;

        if (productData.sub_products && productData.sub_products.length > 0) {
            productData.sub_products = productData.sub_products.map((subProduct, index) => ({
                ...subProduct,
                id: index + 1
            }));
        }

        category.category_items.push(productData);
        await category.save();

        res.json({ success: true, category });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ success: false, message: 'Error updating category', error: error.message });
    }
}

// get products using category id
exports.getProduct = async (req, res) => {
    try {
        const categoryId = parseInt(req.params.categoryId);
        const category = await Category.findOne({ id: categoryId });

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        res.json({ success: true, products: category.category_items });
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ success: false, message: 'Error fetching category', error: error.message });
    }
}

// remove product using product id
exports.removeProduct = async (req, res) => {
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    try {
        const deletedCategory = await Category.findOneAndUpdate(
            { 'category_items.id': productId },
            { $pull: { category_items: { id: productId } } },
            { new: true }
        );

        if (!deletedCategory) {
            return res.status(404).json({ error: 'Product not found in any category' });
        }

        res.json({ message: 'Product removed successfully', deletedCategory });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// add dailydeals
exports.addDailydeal = async (req, res) => {
    try {
        const { product } = req.body;

        const existingDeal = await DailyDeal.findOne({ productId: product._id });

        if (existingDeal) {
            return res.status(400).json({
                success: false,
                message: 'Product already added to Daily Deals'
            });
        }

        const dailyDeal = new DailyDeal({
            productId: product._id,
            id: product.id,
            description: product.description,
            image: product.image,
            offer_price: product.offer_price,
            old_price: product.old_price,
            pack_gram: product.pack_gram,
            product_category_title: product.product_category_title,
            product_name: product.product_name,
            sub_products: product.sub_products,
        });

        await dailyDeal.save();
        res.status(201).json({
            success: true,
            message: 'Product added to Daily Deal successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};


// get daily deal

exports.getDailydeal = async (req, res) => {
    try {
        const dailyDeals = await DailyDeal.find();

        res.status(200).json({
            success: true,
            dailyDeals
        });
    } catch (error) {
        console.error('Error fetching daily deals:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}


// remove Daily deal
exports.removeDailydeal = async (req, res) => {
    try {

        const dailyDeal = await DailyDeal.findOneAndDelete({ id: req.body.id });

        if (dailyDeal) {
            res.status(200).json({
                success: true,
                message: 'Daily deal removed successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Daily deal not found'
            });
        }
    } catch (error) {
        console.error('Error removing daily deal:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}

// add flashsale
exports.addFlashsale = async (req, res) => {
    try {
        const { product } = req.body;

        const existingSale = await Flashsale.findOne({ productId: product._id });

        if (existingSale) {
            return res.status(400).json({
                success: false,
                message: 'Product already added to Flash sale'
            });
        }

        const flashsale = new Flashsale({
            productId: product._id,
            id: product.id,
            description: product.description,
            image: product.image,
            offer_price: product.offer_price,
            old_price: product.old_price,
            pack_gram: product.pack_gram,
            product_category_title: product.product_category_title,
            product_name: product.product_name,
            sub_products: product.sub_products,
        });

        await flashsale.save();

        console.log('Flash sale added successfully.');

        setTimeout(async () => {
            try {
                const result = await Flashsale.findOneAndDelete({ productId: product._id });
                if (result) {
                    console.log(`Flash sale for product ${product._id} removed after timeout.`);
                } else {
                    console.error(`Flash sale for product ${product._id} not found for removal.`);
                }
            } catch (err) {
                console.error('Error removing Flash sale after timeout:', err);
            }
        }, 86400000); // 5 seconds

        res.status(201).json({
            success: true,
            message: 'Product added to Flash sale successfully'
        });
    } catch (error) {
        console.error('Error adding Flash sale:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// get flash sale
exports.getFlashsale = async (req, res) => {
    try {
        const flashsale = await Flashsale.find()

        res.status(200).json({
            success: true,
            flashsale
        });
    }
    catch (error) {
        console.error('Error fetching Flash Sale:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}


exports.removeFlashsale = async (req, res) => {
    try {

        const dailyDeal = await Flashsale.findOneAndDelete({ id: req.body.id });

        if (dailyDeal) {
            res.status(200).json({
                success: true,
                message: 'Flash sale removed successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Flash sale not found'
            });
        }
    } catch (error) {
        console.error('Error removing Flash sale:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}